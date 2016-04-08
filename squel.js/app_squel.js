var squel = require("squel");

var s = squel.select();
s.from("student");
console.log(typeof s);
console.log(typeof s.toString());    /* SELECT * FROM student */
console.log(s.toString());    /* SELECT * FROM student */


var s1 = squel.select().from("TGOODS", "TG")
	      .field("TG.GOODS_NAME")
	      .field("TG.SALE_GB")
console.log(s1.toString());