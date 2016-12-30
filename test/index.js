var assert = require('chai').assert
var demo = require('fmtjs-demo')
var gen_lexical_env = require('../index')
var fmtjs_att_pass_id = require('fmtjs-att-pass-id')

describe('index', function() {
	it('run without any exception', function() {
		var ast = demo.load_ast('empty')
		fmtjs_att_pass_id(ast)
		var ctx = gen_lexical_env(ast)
		assert.isObject(ctx)
		assert.isObject(ctx.env_map)
		// assert.isObject(ctx.identical)
		// assert.isArray(ctx.identical.group)
		// assert.isObject(ctx.identical.map)
	})
})