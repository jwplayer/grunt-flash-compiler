# grunt-flash-compiler

Grunt multitask to compile Flash swf and swc files using AIR or FLEX SDK libraries


### Options
* taskCompilerOptions: array<String> - Extra options to be added to all compilations
* targetCompilerOptions: array<String> - Extra options to be added to a specific compilation
* debug: Boolean - enable debugging options for compiled object
* swc: Boolean - when true, generate a swc library file for linking
* ascshdPort: number - when using ascshd, each project should use a different port

### Example
```js
flash: {
    options: {
        targetCompilerOptions : [
            '-compiler.library-path+='+ 'libs',
            '-define+=JWPLAYER::version,\'' + projects.version + '\''
        ],
        sdk: env.FLEX_HOME,
        ascshdPort: 11124
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
