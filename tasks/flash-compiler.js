var env = process.env;
var fs = require('fs');

module.exports = function(grunt) {
    // Flash compiler multitask
    grunt.registerMultiTask('flash', 'Compile Flash SWF files. ' +
        'Usage `grunt flash:vast:debug|release:air|flex`', function(debug, sdk) {
        var done = this.async();

        var data = this.data;

        var isDebug = debug === 'debug';

        var flashAirOrFlexSdk = (sdk!=='flex' && env.AIR_HOME) || env.FLEX_HOME;
        if (!flashAirOrFlexSdk) {
            grunt.fail.warn('To compile ActionScript, you must set environment '+
                'variable $AIR_HOME or $FLEX_HOME for this task to locate mxmlc.');
        }
        var isFlex = /flex/.test(flashAirOrFlexSdk);

        var command = {
            cmd: flashAirOrFlexSdk + '/bin/mxmlc',
            args: []
        };

        command.args.push(data.main);

        command.args.push(
            '-compiler.source-path=src/flash',
                '-compiler.library-path+=' + flashAirOrFlexSdk + '/frameworks/libs',
            '-external-library-path+=libs/jwplayer.flash.swc',
            '-default-background-color=0x000000',
            '-default-frame-rate=30',
            '-target-player=11.1.0',
                '-use-network=' + data.useNetwork
        );


        // Framework specific optimizations
        if (isFlex) {
            command.args.push(
                '-static-link-runtime-shared-libraries=true'
            );
        } else {
            command.args.push(
                // Enable Telemetry for testing in Adobe Scout
                // '-advanced-telemetry=true',
                '-show-multiple-definition-warnings=true',
                '-compiler.inline=true',
                '-compiler.remove-dead-code=true'
            );

            // ActionScript Compiler 2.0 Shell https://github.com/jcward/ascsh
            var ascshd = fs.existsSync(flashAirOrFlexSdk + '/bin/ascshd');
            if (ascshd) {
                command.cmd = command.cmd.replace('bin/mxmlc', 'bin/ascshd');
                command.args.unshift(
                    '-p', data.ascshdPort + (debug?100:0),
                    'mxmlc'
                );
            }
        }

        if (isDebug) {
            command.args.push(
                    '-output=bin-debug/' + data.dest,
                    '-link-report=bin-debug/' + data.dest.replace('swf', 'link.xml'),
                    '-size-report=bin-debug/' + data.dest.replace('swf', 'size.xml'),
                '-strict=true',
                '-debug=true',
                '-define+=CONFIG::debugging,true',
                '-define+=CONFIG::staging,true'
            );
        } else {
            command.args.push(
                    '-output=bin-release/' + data.dest,
                '-optimize=true',
                '-omit-trace-statements=true',
                '-warnings=false',
                '-define+=CONFIG::debugging,false',
                '-define+=CONFIG::staging,false'
            );
        }

        // Print the mxmlc / ascshd command. Formatted to run in bash.
        grunt.log.writeln(command.cmd +' '+ command.args.join(' '));

        var stdout = [];
        var proc = grunt.util.spawn(command, function(error, result, code) {
            grunt.log.subhead(result.stdout);

            if (error) {
                grunt.log.error(error.message, code);
            }
            done(!error);
        });

        proc.stdout.setEncoding('utf-8');
        proc.stdout.on('data', function(data) {
            stdout.push(data);
        });

        var checkIntervalHandle = setInterval(function() {
            if (/Starting aschd server/.test(stdout.join())) {
                clearInterval(checkIntervalHandle);
                grunt.log.ok(command.cmd);

                grunt.log.subhead(stdout.join());

                done();
            }
        }, 500);
    });
};
