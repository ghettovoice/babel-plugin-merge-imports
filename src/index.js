const createNestedMemberExpression = (pkgVarName, varName, parts, t) => {
  if (parts.length) {
    parts = parts.slice().reverse()

    const matches = varName.match(new RegExp(`(${parts[0]})`, 'i'))
    if (!matches) throw new Error(`Invalid identifier ${varName}`)

    varName = matches[1]

    return t.memberExpression(
      parts.slice(1).reduce(
        (node, name) => t.memberExpression(
          node,
          t.identifier(name)
        ),
        t.identifier(pkgVarName)
      ),
      t.identifier(varName)
    )
  }

  return t.identifier(varName)
}

const createRequireExpression = (pkgName, varName, t) => t.variableDeclaration(
  'var',
  [
    t.variableDeclarator(
      t.identifier(varName),
      t.callExpression(
        t.identifier('require'),
        [
          t.stringLiteral(pkgName)
        ]
      )
    )
  ]
)

module.exports = function ({ types: t }) {
  let identifiers

  return {
    visitor: {
      Program: {
        enter () {
          identifiers = {}
        },
        exit (path, { opts }) {
          if (Object.keys(identifiers).length) {
            path.unshiftContainer('body', createRequireExpression(opts.pkg, opts.pkgVar, t))
          }
        }
      },
      ImportDeclaration (path, state) {
        const opts = state.opts
        if (!opts.regex || !opts.pkg || !opts.pkgVar) return

        const node = path.node
        const spec = node.specifiers.find(spec => t.isImportDefaultSpecifier(spec))
        const matches = node.source.value.match(new RegExp(opts.regex))

        if (spec && matches) {
          identifiers[ spec.local.name ] = matches[ 1 ].split('/')
          path.remove()
        }
      },
      VariableDeclarator (path, { opts }) {
        const node = path.node

        if (t.isIdentifier(node.init) && identifiers[ node.init.name ]) {
          node.init = createNestedMemberExpression(opts.pkgVar, node.init.name, identifiers[ node.init.name ], t)
        }
      },
      MemberExpression (path, { opts }) {
        const node = path.node

        if (t.isIdentifier(node.object) && identifiers[ node.object.name ]) {
          node.object = createNestedMemberExpression(opts.pkgVar, node.object.name, identifiers[ node.object.name ], t)
        }
      },
      NewExpression (path, { opts }) {
        const node = path.node

        if (t.isIdentifier(node.callee) && identifiers[ node.callee.name ]) {
          node.callee = createNestedMemberExpression(opts.pkgVar, node.callee.name, identifiers[ node.callee.name ], t)
        }
      }
    }
  }
}
