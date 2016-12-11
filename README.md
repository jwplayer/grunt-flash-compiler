# grunt-flash-compiler

Grunt multitask to compile Flash swf and swc files


### Options
* taskCompilerOptions: array<String> - Extra options to be added to all compilations
* targetCompilerOptions: array<String> - Extra options to be added to a specific compilation
* debug: Boolean - enable debugging options for compiled object
* swc: Boolean - when true, generate a swc library file for linking

### Example
```js
flash: {
    options: {
        targetCompilerOptions : [
            '-compiler.library-path+='+ 'libs',
            '-define+=PROJECT::version,\'' + projects.version + '\''
        ]
    },
    debug : {
        options : {
            debug : true,
        },
        files : {
            'test/output.swf' : 'src/file.as'
        }
    },
    release : {
        files : {
            'bin/output.swf' : 'src/file.as'
        }
    }
}
```
