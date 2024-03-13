#!/usr/bin/env node
'use strict';

var fs = require('fs');
var helpers = require('./helpers');
var configurations = require(`./configuration`);
	
    // Define the Podfile path
const PODFILE_PATH = 'platforms/ios/Podfile';
var PLATFORM = configurations.PLATFORM;
const NEW_PLATFORM_LINE = `platform :ios, '17.0'\n`;

function editPodfile() {
    const CONTENT = `
post_install do |installer|
 installer.pods_project.targets.each do |target|
  target.build_configurations.each do |config|
   system('sed -i \'\' \'/IPHONEOS_DEPLOYMENT_TARGET = 11.0/IPHONEOS_DEPLOYMENT_TARGET = 17.0/\’ \'CordovaLib/CordovaLib.xcodeproj/project.pbxproj\'')
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
// Replace the platform line
	const updatedContent = data.replace(/platform :ios, '\d+\.\d+'/g, NEW_PLATFORM_LINE);
	fs.writeFile(PODFILE_PATH, updatedContent, 'utf8', (err) => {
		if (err) {
			console.error(`Error writing to Podfile: ${err}`);
			return;
		}
		console.log(`Updated platform version in Podfile to 17.0`);
	});

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
