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

const createImportExpression = (pkgName, varName, t) => t.importDeclaration(
  [
    t.importDefaultSpecifier(t.identifier(varName))
  ],
  t.stringLiteral(pkgName)
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
            // path.unshiftContainer('body', createRequireExpression(opts.pkg, opts.pkgVar, t))
            path.unshiftContainer('body', createImportExpression(opts.pkg, opts.pkgVar, t))
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
      },
      BinaryExpression (path, { opts }) {
        const node = path.node

        if (t.isIdentifier(node.left) && identifiers[ node.left.name ]) {
          node.left = createNestedMemberExpression(opts.pkgVar, node.left.name, identifiers[ node.left.name ], t)
        }
        if (t.isIdentifier(node.right) && identifiers[ node.right.name ]) {
          node.right = createNestedMemberExpression(opts.pkgVar, node.right.name, identifiers[ node.right.name ], t)
        }
      },
      AssignmentExpression (path, { opts }) {
        const node = path.node

        if (t.isIdentifier(node.right) && identifiers[ node.right.name ]) {
          node.right = createNestedMemberExpression(opts.pkgVar, node.right.name, identifiers[ node.right.name ], t)
        }
      },
      ReturnStatement (path, { opts }) {
        const node = path.node

        if (t.isIdentifier(node.argument) && identifiers[ node.argument.name ]) {
          node.argument = createNestedMemberExpression(opts.pkgVar, node.argument.name, identifiers[ node.argument.name ], t)
        }
      },
      ArrayExpression (path, { opts }) {
        const node = path.node

        node.elements = node.elements.map(elem => {
          if (t.isIdentifier(elem) && identifiers[ elem.name ]) {
            return createNestedMemberExpression(opts.pkgVar, elem.name, identifiers[ elem.name ], t)
          }

          return elem
        })
      },
      ObjectProperty (path, { opts }) {
        const node = path.node

        if (t.isIdentifier(node.value) && identifiers[ node.value.name ]) {
          node.value = createNestedMemberExpression(opts.pkgVar, node.value.name, identifiers[ node.value.name ], t)
        }
      },
      ClassDeclaration (path, { opts }) {
        const node = path.node

        if (t.isIdentifier(node.superClass) && identifiers[ node.superClass.name ]) {
          node.superClass = createNestedMemberExpression(opts.pkgVar, node.superClass.name, identifiers[ node.superClass.name ], t)
        }
      }
    }
  }
}
