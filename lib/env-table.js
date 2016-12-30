var assert = require('assert')

// Environment Table 抽象
// 通过接口进行操作，外部使用者触碰不到内部存储结构
function EnvTable() {
	var env_tree_list = []
	var ast_to_env = {}

	return {
		add_env: function(env, parent_id) {
			// env 参数必须提供
			assert(env)

			// 如果填写了 parent_id 那么对应的 env 必须存在
			if (parent_id !== undefined) {
				assert(env_tree_list[parent_id])
			}

			// 设定 id 和 parent_id 属性
			env.id = env_tree_list.length
			env.parent_id = parent_id

			// 添加到列表
			env_tree_list.push(env)

			// 如果这个 env 与某个 ast 存在对应关系
			// 则记录下这种关系
			if (env.ast_id !== undefined) {
				ast_to_env[env.ast_id] = env.id
			}

			return env
		},
		env_of_ast: function(ast_id) {
			var env_id = ast_to_env[ast_id]
			if (env_id) {
				var env = env_tree_list[env_id]
				assert(env)
				return env
			}
		},
		add_binding: function(binding) {

		},
		add_binding_on_parent: function(binding) {

		},
		dumpData: function() {
			return env_tree_list
		}
	}
}

module.exports = EnvTable