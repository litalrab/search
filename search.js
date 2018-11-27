const path = require('path');
const fs = require('fs');

function searchFilesInDirectory( ext, filter) {

    var cwd=process.cwd();
    const filesInDir = getFilesInDirectory(cwd, '\.' + ext);
    var fileFound='false';

    filesInDir.forEach(file => {
        const fileContent = fs.readFileSync(file);

        // We want full words, so we use full word boundary in regex.
        const regex = new RegExp('\\b' + filter + '\\b');
        if (regex.test(fileContent)) {
            console.log(`Your word was found in file: ${file}`);
            fileFound=true;
        }
    });

    if(fileFound=='false')
    {
        console.log(`No file was found`);
    }
}

function cheackExtension(files,file, ext,filePath) {
    if (path.extname(file) === ext) {
        files.push(filePath);
    }
}
// Using recursion, we find every file with the desired extention, even if its deeply nested in subfolders.
function getFilesInDirectory(dir, ext) {
    if (!fs.existsSync(dir)) {
        console.log(`Specified directory: ${dir} does not exist`);
        return;
    }

    let files = [];
    fs.readdirSync(dir).forEach(file => {
        const filePath = path.join(dir, file);
        const fileStatus = fs.lstatSync(filePath);

        // If we hit a directory, apply our function to that dir. If we hit a file, add it to the array of files.
        if (fileStatus.isDirectory()) {
            const nestedFiles = getFilesInDirectory(filePath, ext);
            files = files.concat(nestedFiles);
        } else {
            cheackExtension(files,file, ext,filePath) ;
        }
    });

    return files;
}
//__filename
//Running application without any parameter prints a simple help message
const NumOfArgs = 4;

if(process.argv.length!=NumOfArgs)
{
    console.log("USAGE: node search [EXT] [TEXT]");
   process.exit(-1);
        

}
else{
    searchFilesInDirectory(process.argv[2], process.argv[3]);

}
