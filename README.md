# Mass Linter

## Installation instructions

First, clone the repo:

```bash
git clone https://github.com/roee-shapira/mass-linter.git
```

And then:

```bash
$ cd mass-linter
$ npm install
$ npm start
```

### Optional flags

- `--dry-run` or `-d`: Runs the program but the files are *not* changed
- `--no-prettier`: Do not run the prettier task
- `--no-eslint`: Do not run the eslint task
- `--no-time`: Do not output the run time it took for each task

For example:

```bash
$ npm start -- --dry-run
```