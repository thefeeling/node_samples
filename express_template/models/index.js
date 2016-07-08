// var fs = require('fs');
//
// module.exports = function(app){
//     fs.readdirSync(__dirname).forEach(function(file) {
//     	console.log(__dirname);
//         if (file === "index.js" || file.substr(file.lastIndexOf('.') + 1) !== 'js'){
//             return;
//         }
//         var name = file.substr(0, file.indexOf('.'));
//         console.log(name + ' route load');
//         require('./' + name)(app);
//     });
// }
