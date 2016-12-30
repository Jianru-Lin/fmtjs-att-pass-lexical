var assert = require('assert')
var walk = require('fmtjs-ast-walker').walk

function env_tracer(idmap) {
	assert(idmap)
	assert(idmap.ast2env)
	assert(idmap.env2ast)

	var next_id = 0
	var stack = []
	return {
		enter_global: function() {
			assert(next_id === 0)
			assert(stack.length === 0)
			var env = {
				type: 'global',
				id: next_id.toString(),
				table: {}
			}
			stack.push(env)
			++next_id
		},
		enter_module: function() {
			assert(next_id === 1)
			assert(stack.length === 1)
			var env = {
				type: 'module',
				id: next_id.toString(),
				table: {}
			}
			stack.push(env)
			++next_id
		},
		enter_function: function(ast) {
			var env = idmap.ast2env[ast.fmtjs_id]
			if (!env) {
				var id = next_id.toString()
				++next_id
				var parent_id = stack.length > 0 ? stack[stack.length - 1].id.toString() : undefined
				var env = {
					type: 'function',
					id: id,
					parent_id: parent_id,
					ast_id: ast.fmtjs_id,
					ast_type: ast.type,
					table: {}
				}
				idmap.env2ast[env.id] = ast.fmtjs_id
			}
			
			stack.push(env)
		},
		leave: function() {
			stack.pop()
		},
		current: function() {
			if (stack.length >= 1) {
				return stack[stack.length -1]
			}
			else {
				return undefined
			}
		},
		stack: function() {
			return stack.slice()
		},
		parent: function() {
			if (stack.length >= 2) {
				return stack[stack.length - 2]
			}
			else {
				return undefined
			}
		},
	}
}

function walk_env(root, env_map, callout) {
	assert(root)
	assert(env_map)
	assert(env_map.env2ast)
	assert(env_map.ast2env)
	assert(callout)

	var tracer = env_tracer(env_map)

	walk(root, {
		enter: function(ast, nav) {
			switch (ast.type) {
				case 'Program':
					tracer.enter_global()
					tracer.enter_module()
					break
				case 'FunctionDeclaration':
					tracer.enter_function(ast)
					break
			}

			var handler = callout[ast.type]
			if (handler && handler.enter) {
				var env = tracer.current()
				handler.enter(ast, nav, env)
			}
		},
		leave: function(ast, nav) {
			var handler = callout[ast.type]
			if (handler && handler.leave) {
				var env = tracer.current()
				handler.leave(ast, nav, env)
			}

			switch (ast.type) {
				case 'Program':
					tracer.leave() // leave module
					tracer.leave() // leave global
					break
				case 'FunctionDeclaration':
					tracer.leave()
					break
			}
		}
	})
}

function EnvWalker(state) {
	if (!state) {
		state = {}
	}

	return function(root, callout) {
		walk_env(root, state, callout)
		return state
	}
}

module.exports = EnvWalker