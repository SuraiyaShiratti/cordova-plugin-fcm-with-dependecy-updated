#!/usr/bin/env node
'use strict';

var fs = require('fs');
var helpers = require('./helpers');
var configurations = require(`./configuration`);
	
    // Define the Podfile path
const PODFILE_PATH = 'platforms/ios/Podfile';
var PLATFORM = configurations.PLATFORM;

function editPodfile() {
    const CONTENT = `
post_install do |installer|
 installer.pods_project.targets.each do |target|
  target.build_configurations.each do |config|
   config.build_settings['IPHONEOS_DEPLOYMENT_TARGET'] = '17.0'
  end
 end
end
`;


    // Read the existing Podfile content
    fs.readFile(PODFILE_PATH, 'utf8', (err, data) => {
    if (err) {
        console.error(`Error reading Podfile: ${err}`);
        return;
    }

    // Check if the post_install section already exists
    if (!data.includes('post_install')) {
        // Add the content to the Podfile
        fs.appendFile(PODFILE_PATH, CONTENT, (err) => {
        if (err) {
            console.error(`Error appending content to Podfile: ${err}`);
            return;
        }
        console.log(`Added post_install section to Podfile at ${PODFILE_PATH}`);
        });
    } else {
        console.log(`post_install section already exists in Podfile at ${PODFILE_PATH}`);
    }
    });
}



if (PLATFORM.IOS) {
    editPodfile();
}
