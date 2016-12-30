var assert = require('assert')

function lex_manager(tracer) {
	return {
		add: function(name, ast_id) {
			assert(name)
			var current = tracer.current()
			assert(current)
			var lex = {
				id: current.list.length.toString(),
				name: name,
				ast_id: ast_id
			}
			current.list.push(lex)
		},
		add_on_parent: function(name, ast_id) {
			assert(name)
			var parent = tracer.parent()
			assert(parent)
			var lex = {
				id: parent.list.length.toString(),
				name: name,
				ast_id: ast_id
			}
			parent.list.push(lex)
		},
		resolve: function(name) {
			assert(name)
			var stack = tracer.stack()
			assert(stack)
			assert(stack.length > 0)
			for (var i = stack.length; i >= 0; --i) {
				var env = stack[i]
				var lex = find_lex_in_env(env, name)
				if (lex) {
					return lex
				}
			}

			function find_lex_in_env(env, name) {
				var list = env.list
				for (var i = 0, len = list.length; i < len; ++i) {
					if (list[i].name === name) {
						return list[i]
					}
				}
				return undefined
			}
		}
	}
}