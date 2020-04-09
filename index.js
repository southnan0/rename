#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const argv = require('argv');
const inquirer = require('inquirer');

const args = argv.option({
    name:'directionPath',
    short:'p',
    type:'string',
    description:'',
    example:'script -p C:\\Users\\nan\\Desktop\\min'
}).run();

if (!args.options.directionPath) {
    dirPath = path.resolve('./');
} else {
    dirPath = path.resolve(args.options.directionPath);
}

inquirer.prompt([{
    type:'list',
    name:'action',
    message:'请选择动作',
    choices:[{
        name:'增加-min',
        value:'add'
    },{
        name:'去掉-min',
        value:'remove'
    }]
}]).then(({action})=>{
    if(action === 'add'){
        addPostFix();
    }else {
        removePostFix();
    }

}).catch((error)=>{
    throw error;
});

//  遍历目录得到文件信息
function walk(path, callback) {
    const files = fs.readdirSync(path);

    files.forEach(function(file){
        if (fs.statSync(path + '/' + file).isFile()) {
            callback(path, file);
        }
    });
}

// 修改文件名称
function rename (oldPath, newPath) {
    fs.rename(oldPath, newPath, function(err) {
        if (err) {
            throw err;
        }
    });
}

const removePostFix = ()=>{
    walk(dirPath, function (path, fileName) {
        const oldPath = path + '/' + fileName, // 源文件路径
            newPath = path + '/'+ fileName.replace(/-min/, ''); // 新路径

        rename(oldPath, newPath);
    });
};

const addPostFix = ()=>{
    walk(dirPath, function (path, fileName) {
        const [name,postfix] = fileName.split('.');
        const oldPath = path + '/' + fileName, // 源文件路径
            newPath = `${path}/${name}-min.${postfix}`;

        rename(oldPath, newPath);
    });
};

