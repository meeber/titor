import {execAsync} from "./sh";

export default function LinterEslint () {
  return {
    run () { return execAsync("eslint --fix .") },
  };
}
