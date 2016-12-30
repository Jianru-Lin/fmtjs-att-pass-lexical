var assert = require('assert')
var EnvWalker = require('./env-walker')

function gen_lexical_env(root) {
	assert(typeof root.fmtjs_id === 'string')
	var env_table = {}
	var env_walker = EnvWalker(env_table)

	// handle declaration

	env_walker(root, {
		'FunctionDeclaration': {
			enter: function(ast, nav, env) {
				
				assert(env)

				env_table[env.parent_id].table[ast.id.name] = {
					type: 'function'
				}

				env.table['this'] = {
					type: 'function::this'
				}

				env.table['arguments'] = {
					type: 'function::arguments'
				}

				if (ast.params) {
					ast.params.forEach(function(p) {
						if (p.type === 'Identifier') {
							env.table[p.name] = {
								type: 'function::parameter',
								ast_id: p.fmtjs_id
							}
						}
						else {
							console.log('unknown param type: ' + p.type)
						}
					})
				}
			}
		},
		'VariableDeclaration': {
			enter: function(ast, nav, env) {
				assert(env)
				assert(ast.kind === 'var') // let, const not supported yet

				if (!ast.declarations) return
				
				ast.declarations.forEach(function(d) {
					assert(d.type === 'VariableDeclarator')
					var id = d.id
					if (id.type === 'Identifier'){
						env.table[id.name] = {
							type: 'variable',
							ast_id: id.fmtjs_id
						}
					}
					else {
						console.log('unknown id type: ' + id.type)
					}
				})
			}
		}
	})

	console.log(env_table)

	// resolve reference

	env_walker(root, {
		'Identifier': {
			enter: function(ast, nav, lexman) {

			}
		}
	})

	return env_table
}

module.exports = gen_lexical_env