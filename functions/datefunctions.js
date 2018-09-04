var db  = require( '../db.js' );
//function for reset password
exports.timerreset = function timerreset(){
db.query( 'SELECT date FROM reset WHERE status = ?' ['active'], function ( err, results, fields ){
	if ( err ) throw err;
	if( results.length  > 0  ){
	var i = 0
	while ( i> results.length  ){
		var dt = results[i].date;
		var min  = new Date().getMinutes();
		var year  = new Date().getFullYear();
		var month  = new Date().getMonth();
		var date  = new Date().getDate();
		var hour  = new Date().getHours();
		var calmin  = dt.setMinutes( dt.getMinutes() + 15);
		var calhour = dt.setHours( dt.getHours() + 0);
		var caldate  = dt.setDate( dt.getDate() + 0);
		var calyear  = dt.setFullYear( dt.getFullYear() + 0);
		var calmonth = dt.setMonth( dt.getMonth() + 0)
		if( calmin >=  min){
			db.query( 'UPDATE reset SET status  = ? WHERE date = ?', ['expired', dt], function ( err, results, fields){
			if( err ) throw err;
		});
	}else if( calmin < min && calhour > hour ){
		db.query( 'UPDATE reset SET status  = ? WHERE date = ?', ['expired', dt], function ( err, results, fields){
			if( err ) throw err;
		});
	}else if(calmin < min && calhour < hour && caldate > date){
		db.query( 'UPDATE reset SET status  = ? WHERE date = ?', ['expired', dt], function ( err, results, fields){
			if( err ) throw err;
		});
	}else if(calmin < min && calhour < hour && caldate < date && calmonth > month){
		db.query( 'UPDATE reset SET status  = ? WHERE date = ?', ['expired', dt], function ( err, results, fields){
			if( err ) throw err;
		});
	}else if(calmin < min && calhour < hour && caldate < date && calmonth < month && calyear > year){
		db.query( 'UPDATE reset SET status  = ? WHERE date = ?', ['expired', dt], function ( err, results, fields){
			if( err ) throw err;
		});
	}
i++;
}
}
if( results.length === 0 ){
	console.log( 'no expired link' )
}
});
}