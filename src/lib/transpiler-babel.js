export default function TranspilerBabel (sh) {
  function transpile (compat) {
    return sh.execAsync(`BABEL_ENV=${compat} babel -d ${compat}-build/ src/`);
  }

  return {
    run () {
      return Promise.all([
        transpile("current"),
        transpile("legacy"),
      ]);
    },
  };
}
