"use strict";

import { paths } from "../gulpfile.babel";
import gulp from "gulp";

gulp.task("php", () => {
	return gulp.src(paths.php.src)
		.pipe(gulp.dest(paths.php.dist))
});
