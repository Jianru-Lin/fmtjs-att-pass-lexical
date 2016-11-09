var assert = require('assert')
var walk_type = require('fmtjs-ast-walker').walk_type

function gen_lexical_env(root) {
	assert(typeof root.fmtjs_id === 'number')
	
	// id -> env
	var table = {}
	var env_stack = []
	walk_type(root, {
		'Program': {
			enter: function(ast, nav) {
				var env = {
					parent_fmtjs_id: env_stack.length > 0 ? env_stack[env_stack.length-1].fmtjs_id : null,
					fmtjs_id: ast.fmtjs_id,
					type: ast.type,
				}
				env_stack.push(env)
				table[ast.fmtjs_id] = env
			},
			leave: function(ast, nav) {
				env_stack.pop()
			}
		},
		'FunctionDeclaration': {
			enter: function(ast, nav) {
				var env = {
					parent_fmtjs_id: env_stack.length > 0 ? env_stack[env_stack.length-1].fmtjs_id : null,
					fmtjs_id: ast.fmtjs_id,
					type: ast.type,
					name: ast.fmtjs_id.name,
				}
				env_stack.push(env)
				table[ast.fmtjs_id] = env
			},
			leave: function(ast, nav) {
				env_stack.pop()
			}
		},
		'FunctionExpression': {
			enter: function(ast, nav) {
				var env = {
					parent_fmtjs_id: env_stack.length > 0 ? env_stack[env_stack.length-1].fmtjs_id : null,
					fmtjs_id: ast.fmtjs_id,
					type: ast.type,
					// name: ast.fmtjs_id.name,
				}
				env_stack.push(env)
				table[ast.fmtjs_id] = env
			},
			leave: function(ast, nav) {
				env_stack.pop()
			}
		},
		'ArrowFunctionExpression': {
			enter: function(ast, nav) {
				var env = {
					parent_fmtjs_id: env_stack.length > 0 ? env_stack[env_stack.length-1].fmtjs_id : null,
					fmtjs_id: ast.fmtjs_id,
					type: ast.type,
					// name: ast.fmtjs_id.name,
				}
				env_stack.push(env)
				table[ast.fmtjs_id] = env
			},
			leave: function(ast, nav) {
				env_stack.pop()
			}
		},
	})
	return table
}

module.exports = gen_lexical_env