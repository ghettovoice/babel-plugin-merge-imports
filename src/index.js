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
        const spec = node.specifiers.find(spec => t.isImportDefaultSpecifier(spec))
        const matches = node.source.value.match(new RegExp(opts.regex))

        if (spec && matches) {
          identifiers[ spec.local.name ] = matches[ 1 ].split('/')
          path.remove()
        }
      },
    }
  }
}
