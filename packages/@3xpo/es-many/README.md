<!--
YOU'RE NOT IN THE RIGHT PLACE! To contribute, please go to https://codeberg.org/Expo/pkgs, rather than looking here!!!!
YOU'RE NOT IN THE RIGHT PLACE! To contribute, please go to https://codeberg.org/Expo/pkgs, rather than looking here!!!!
YOU'RE NOT IN THE RIGHT PLACE! To contribute, please go to https://codeberg.org/Expo/pkgs, rather than looking here!!!!
YOU'RE NOT IN THE RIGHT PLACE! To contribute, please go to https://codeberg.org/Expo/pkgs, rather than looking here!!!!
YOU'RE NOT IN THE RIGHT PLACE! To contribute, please go to https://codeberg.org/Expo/pkgs, rather than looking here!!!!
YOU'RE NOT IN THE RIGHT PLACE! To contribute, please go to https://codeberg.org/Expo/pkgs, rather than looking here!!!!
YOU'RE NOT IN THE RIGHT PLACE! To contribute, please go to https://codeberg.org/Expo/pkgs, rather than looking here!!!!
YOU'RE NOT IN THE RIGHT PLACE! To contribute, please go to https://codeberg.org/Expo/pkgs, rather than looking here!!!!
YOU'RE NOT IN THE RIGHT PLACE! To contribute, please go to https://codeberg.org/Expo/pkgs, rather than looking here!!!!
YOU'RE NOT IN THE RIGHT PLACE! To contribute, please go to https://codeberg.org/Expo/pkgs, rather than looking here!!!!
YOU'RE NOT IN THE RIGHT PLACE! To contribute, please go to https://codeberg.org/Expo/pkgs, rather than looking here!!!!
YOU'RE NOT IN THE RIGHT PLACE! To contribute, please go to https://codeberg.org/Expo/pkgs, rather than looking here!!!!
YOU'RE NOT IN THE RIGHT PLACE! To contribute, please go to https://codeberg.org/Expo/pkgs, rather than looking here!!!!
YOU'RE NOT IN THE RIGHT PLACE! To contribute, please go to https://codeberg.org/Expo/pkgs, rather than looking here!!!!
YOU'RE NOT IN THE RIGHT PLACE! To contribute, please go to https://codeberg.org/Expo/pkgs, rather than looking here!!!!
YOU'RE NOT IN THE RIGHT PLACE! To contribute, please go to https://codeberg.org/Expo/pkgs, rather than looking here!!!!
YOU'RE NOT IN THE RIGHT PLACE! To contribute, please go to https://codeberg.org/Expo/pkgs, rather than looking here!!!!
YOU'RE NOT IN THE RIGHT PLACE! To contribute, please go to https://codeberg.org/Expo/pkgs, rather than looking here!!!!
YOU'RE NOT IN THE RIGHT PLACE! To contribute, please go to https://codeberg.org/Expo/pkgs, rather than looking here!!!!
-->

<div align="center">

# Mirror

This is a Github mirror of [this codeberg repo](https://codeberg.org/Expo/pkgs).

This repository is read-only. Please use the above repository for forking, contributing and opening issues.

The original README is attached below for reference purposes. It may be outdated and not reflect the current README.

</div>

# es-many

Call esbuild with many input/output types.

## Note

This is an internal tool. It is not necessarily perfect + i don't really care.

It's also highly unfinished. Enjoy!

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

## Usage

```bash
esmany --args "src/main.ts --sourcemap --packages=external" --output dist/main --minify
```

The value in `--args` is passed to it directly. The output file will have the extension automatically appended; ie `index` turns into `index.node.cjs`. Note that `--args` is **NOT** sanitized; even if you properly pass it in, it'll just be slapped on the end of the esbuild command. If untrusted input is passed, the user **CAN** trigger arbitrary code execution.

The value of `--args` **MUST NOT** start with `--`; you should instead start it with your sourcefile.

The output will append as follows: `[.node|.browser][.bundle][.min][.iife].(c|m)js`

## Options

Each one of these should have atleast one value specified. To specify multiple values, separate values by commas.

### Minification

`--minify true|false`

### Platforms

`--platform node|browser|neutral`

### Formats

`--format iife|cjs|esm`

### Bundling

`--bundle true|false`
