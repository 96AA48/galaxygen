## galaxygen

![galaxygen in urxvt](https://i.imgur.com/lrZOJWy.gif)

A quite complex galaxy generater based on the work seen [here](http://loewald.com/galaxy).
I'm currently making a game that needed a generated galaxy, so I thought that someone else could maybe use this tool as well.
In this newer version (v1.1.0) I took care of some inconsistencies that caused the program to spit out different galaxies on the same seed. 

Have fun!

## Install :
```
npm i galaxygen -g
```

## Usage :
```
Usage:
  galaxygen [OPTIONS] [ARGS]

Options:
  -s, --seed STRING      The seed you want to generate with. (defaults to '1234')
  -a, --amount NUMBER    The amount of stars you want to generate. (defaults to 1000)
  -o, --output STRING    The output file (if enabled). (defaults to printing JSON to stdout)
  -h, --help             Display help and usage details

```

## Contributing

If you want to add something to the project or add other factors to this generator, feel free to either create an issue or to clone the repository and submit a pull request!

All help is welcome!

## Original

The original work of this galaxy generator can be found at http://loewald.com/galaxy.

## LICENSE
Check out the `LICENSE` file for more information.
