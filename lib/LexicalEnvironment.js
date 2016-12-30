var assert = require('assert')

// LexicalEnvrionment （以下简称 LE）代表了词法环境
// 一系列 LE 构成一棵树，可以通过 LE 的 parent 和 children 属性进行导航
// 另外，可以在 LE 添加 binding 记录，当然也可以进行 binding 的查询，查询时会向上回溯

function LexicalEnvironment(id, parent) {

	// 当前对象主要的数据构成如下
	this.id = id
	this.parent = parent
	this.children = []
	this.binding = {}

	// id 参数必须提供，而且必须是非空字符串
	assert(typeof id === 'string')
	assert(id.length > 0)

	if (parent) {
		// 如果提供了 parent 参数，那么它必须也是一个 LexicalEnvironment 对象
		assert(parent.constructor === LexicalEnvironment)
		// 由于父子关系是双向的，因此这里需要修改 parent 对象的 children 列表
		// 把当前对象加入
		parent.children.push(this)
	}
}

LexicalEnvironment.prototype.addBinding = function(name, def) {
	assert(typeof name === 'string')
	assert(name.length > 0)

	// 覆盖是可能的，但目前我们禁止这么做，因为需要做一些研究
	assert(this.binding.hasOwnProperty(name) === false)

	this.binding[name] = def
}

LexicalEnvironment.prototype.queryBinding = function(name) {
	assert(typeof name === 'string')
	assert(name.length > 0)

	// 如果当前节点上能找到，则直接返回
	if (this.binding[name]) {
		// 注意返回的信息很丰富
		return {
			le: this,					// LE 节点
			name: name,					// name 参数
			def: this.binding[name]		// def 信息
		}
	}
	// 否则如果有父节点，就问询父节点
	else if (this.parent) {
		return this.parent.queryBinding(name)
	}
	// 实在找不到，返回 undefined
	else {
		return undefined
	}
}

LexicalEnvironment.prototype.dumpData = function() {
	return {
		id: this.id,
		parent_id: this.parent ? this.parent.id : undefined,
		binding: this.binding
	}
}

LexicalEnvironment.prototype.dumpTreeData = function(map) {
	if (!map) {
		map = {}
	}

	map[this.id] = this.dumpData()
	this.children.forEach(function(child) {
		child.dumpTreeData(map)
	})

	return map
}

module.exports = LexicalEnvironment