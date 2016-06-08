import {execAsync} from "./sh";

export default function TranspilerBabel () {
  function transpile (compat) {
    return execAsync(`BABEL_ENV=${compat} babel`
                   + ` -s`
                   + ` -d ${compat}-build/`
                   + ` src/`);
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
