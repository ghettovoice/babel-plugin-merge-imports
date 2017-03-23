const OPENLAYERS_PKG = 'openlayers'
const OL_REGEX = /^ol(?:\/(.*))?$/
const OL_VAR = '_ol_'

const createNestedMemberExpression = (name, parts, t) => {
  if (parts.length) {
    parts = parts.slice().reverse()

    const matches = name.match(new RegExp(`(${parts[0]})`, 'i'))
    if (!matches) throw new Error(`Invalid ol identifier ${name}. You should use original OpenLayers identifier in variable name`)

    name = matches[1]

    return t.memberExpression(
      parts.slice(1).reduce(
        (node, name) => t.memberExpression(
          node,
          t.identifier(name)
        ),
        t.identifier(OL_VAR)
      ),
      t.identifier(name)
    )
  }

  return t.identifier(name)
}

const createRequireExpression = (name, t) => t.variableDeclaration(
  'var',
  [
    t.variableDeclarator(
      t.identifier(OL_VAR),
      t.callExpression(
        t.identifier('require'),
        [
          t.stringLiteral(name)
        ]
      )
    )
  ]
)

module.exports = function ({ types: t }) {
  const identifiers = {}
  let openlayersImported = false

  return {
    visitor: {
      ImportDeclaration (path) {
        const node = path.node
        const spec = node.specifiers.find(spec => t.isImportDefaultSpecifier(spec))
        const matches = node.source.value.match(OL_REGEX)

        if (spec && matches) {
          identifiers[ spec.local.name ] = matches[ 1 ].split('/')
          path.remove()

          if (!openlayersImported) {
            path.parent.body.unshift(createRequireExpression(OPENLAYERS_PKG, t))
            openlayersImported = true
          }
        }
      },
      VariableDeclarator (path) {
        const node = path.node

        if (t.isIdentifier(node.init) && identifiers[ node.init.name ]) {
          node.init = createNestedMemberExpression(node.init.name, identifiers[ node.init.name ], t)
        }
      },
      MemberExpression (path) {
        const node = path.node

        if (t.isIdentifier(node.object) && identifiers[ node.object.name ]) {
          node.object = createNestedMemberExpression(node.object.name, identifiers[ node.object.name ], t)
        }
      },
      NewExpression (path) {
        const node = path.node

        if (t.isIdentifier(node.callee) && identifiers[ node.callee.name ]) {
          node.callee = createNestedMemberExpression(node.callee.name, identifiers[ node.callee.name ], t)
        }
      }
    }
  }
}
