const createNestedMemberExpression = (pkgVarName, varName, parts, t) => {
  if (parts.length) {
    return parts.reduce(
      (node, name) => t.memberExpression(
        node,
        t.identifier(name)
      ),
      t.identifier(pkgVarName)
    )
  }

  return t.identifier(varName)
}

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
            path.unshiftContainer('body', createImportExpression(opts.pkg, opts.pkgVar, t))

            const bodyPath = path.get('body')
            const imports = bodyPath.filter(n => t.isImportDeclaration(n)) || []
            let lastPath = imports[imports.length - 1]

            Object.keys(identifiers).forEach((localName) => {
              const varNode = t.variableDeclaration('const', [
                t.variableDeclarator(
                  t.identifier(localName),
                  createNestedMemberExpression(opts.pkgVar, localName, identifiers[localName], t)
                )
              ])

              if (lastPath) {
                lastPath = lastPath.insertAfter(varNode)[0]
              }
            })
          }
        }
      },
      ImportDeclaration (path, {opts}) {
        if (!opts.regex || !opts.pkg || !opts.pkgVar) return

        const node = path.node
        const matches = node.source.value.match(new RegExp(opts.regex))

        if (!matches) {
          return
        }

        node.specifiers.forEach(spec => {
          identifiers[ spec.local.name ] = matches[ 1 ].split('/')
          if (t.isImportSpecifier(spec)) {
            identifiers[ spec.local.name ].push(spec.imported.name)
          }
        })

        path.remove()
      },
    }
  }
}
