import {execAsync} from "./sh";

function lint () {
  return execAsync("eslint --fix .");
}

export default {lint};
