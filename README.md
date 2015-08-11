# grunt-flash-compiler

Grunt mutitask to compile Flash swf and swc files using AIR or FLEX SDK libraries


### Options
* compilerLibraryPath: string
* externalLibraryPath: string
* ascshdPort: number
* debug: Boolean

```js
{
  flash: {
    debug: {
      options: {
        debug:true,
        ascshdPort: 11111
      },
      files: {
        'destination/file.swf' : 'main/source/file.as'
      }
    }
  }
}
```
