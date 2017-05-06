let http = require('http');
let cheerio = require('cheerio');
let fs = require('fs');
let url = "http://www.nipic.com/index.html";

function imgLoad(url,callback){
	http.get(url,(res) => {
		res.setEncoding('binary');
		let html = '';
		res.on('data',(chunk) => {
			html += chunk;
		})
		res.on('end', () => {
			callback(html);
		})
	}).on('error', (err) => {
		console.log(err);
	})
}

function callback(html){
	let $ = cheerio.load(html);
	let img = $('img');
	img.each((index,value) => {
		// console.log($(this));
		// console.log(value);
		let imgSrc = value.attr('src');
		http.get(imgSrc,(res) => {
			res.setEncoding('binary');
			let imgData  = '';
			res.on('data',(chunk) => {
					imgData += chunk;
				})
				res.on('end', () => {
					let imgName = "/Paddy"+index+imgSrc.lastIndexOf('.');
					let dirPath = __dirname + '/images' + imgName;
					fs.writeFile(dirPath,imgData,'binary',(err) => {
						console.log(err);
					})
				})
			})
	})
}

imgLoad(url,callback)