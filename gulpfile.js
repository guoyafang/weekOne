var  gulp=require("gulp");
var  webserver=require("gulp-webserver");
var fs=require("fs");
var qs=require("qs");
var url=require("url");
var htmlmin=require("gulp-htmlmin");
var clean=require("gulp-clean-css");
var uglify=require("gulp-uglify");
var rename=require("gulp-rename");

//读取json文件
var datasString=fs.readFileSync("data.json").toString();
gulp.task("mockserver",function(){
    gulp.src(".")
        .pipe(webserver({
            port:"8080",
            middleware:function(request,response,next){
                response.setHeader('Access-Control-Allow-Origin',"*")
                response.setHeader("content-type","application/json;charset=utf-8");
                response.end(datasString)
            }
        }))
})
//压缩html
var options={
    removeComments: true,//清除HTML注释
    collapseWhitespace: true,//压缩HTML
    collapseBooleanAttributes: true,//省略布尔属性的值 <input checked="true"/> ==> <input />
    removeEmptyAttributes: true,//删除所有空格作属性值 <input id="" /> ==> <input />
    removeScriptTypeAttributes: true,//删除<script>的type="text/javascript"
    removeStyleLinkTypeAttributes: true,//删除<style>和<link>的type="text/css"
    minifyJS: true,//压缩页面JS
    minifyCSS: true//压缩页面CSS
}
//压缩html
gulp.task("zlibhtml",function(){
    gulp.src(".")
        .pipe(htmlmin(options))
        .pipe(rename("index.min.html"))
        .pipe(gulp.dest("./html/"))
})
//压缩js
gulp.task("zlibjs",function(){
  gulp.src("./gulpfile.js")
      .pipe(uglify())
      .pipe(rename("gulpfile.min.js"))
      .pipe(gulp.dest("./js/"))
})
//压缩css并且添加前缀名
gulp.task("zlibcss",function(){
    var postCss=require("gulp-postcss");
    var autoprefixer=require("autoprefixer")
    gulp.src("./*.css")
        .pipe(postCss([autoprefixer({browsers:["last 2 versions"]})]))
        .pipe(clean())
        .pipe(rename('./style.min.css'))
        .pipe(gulp.dest("./css/"))
})

gulp.task("default",["mockserver","zlibhtml","zlibcss","zlibjs"])
