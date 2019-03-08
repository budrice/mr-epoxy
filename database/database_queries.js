let jwt = require('jwt-simple');
let bcrypt = require('bcryptjs');
let mysql = require('mysql');
let Emailer = require('./../emailer/emailer.js');
let emailer = new Emailer();
let config = require('./../config.json');

let db = mysql.createPool({
	connectionLimit: config.connectionLimit,
	connectTimeout: config.connectTimeout,
	multipleStatements: config.multipleStatements,
	host: config.dbServerIP,
	user: config.dbUser,
	password: config.dbPass,
	database: config.db
});
db.on('error', (error) => {
	console.log(error);
});

module.exports = function () {

	return {
		Login: login,
		Register: register,
        GetProducts: getProducts,
        Search: search,
        Insert: insert,
        Update: update,
        UserSearch: userSearch,
        GetInvoice: getInvoice,
        UpdateUnassignedInvoices: updateUnassignedInvoices,
        RemoveCartItem: removeCartItem
	};

	function login(member) {
        
		return new Promise((resolve, reject) => {
            let response = {};
            
            validate((error) => { reject(error); })
            .then(updateMember, (error) => { reject(error); })
            .then((result) => {
                resolve(result);
            });

            function validate() {

                let promise = new Promise((resolve, reject) => {

                    if (!member.id) {
                        resolve({ error: { message: "Unable to login." } });
                    }

                    let sql = "SELECT * FROM `mr-epoxy`.member WHERE id = ?;";

                    try {

                        db.query(sql, [member.id], function (error, result) {

                            if (error) {
                                
                                let response = {};
                                response.error = error;
                                resolve(response);

                            }
                            else {
                                let response = {};
                                if (result.length > 0) {

                                    if (bcrypt.compareSync(member.password, result[0].password)) {
                                        response.result = {};
                                        response = result[0];
                                        resolve(response);
                                    }
                                    else {
                                        response.error = {};
                                        response.error.message = "Your password is incorrect.";
                                        resolve(response);
                                    }

                                }
                                else {
                                    response.error = {};
                                    response.error.message = "Your username is incorrect.";
                                    resolve(response);
                                }
                            }

                        });

                    }
                    catch (error) {
                        reject(error);
                    }


                });
                return promise;

            }

            function updateMember(dbresult) {

                let response = {};
                return new Promise((resolve, reject) => {
                    if (dbresult.error) {
                        resolve(dbresult);
                    }
                    else {
    
                        if (dbresult.access_level === 0) {
                            response.error = {};
                            response.error.message = "Your account is currently locked out.";
                            resolve(response);
                        }
                        else {
                            response = {
                                user_id: dbresult.id,
                                password: dbresult.password,
                                email: dbresult.email,
                                username: dbresult.username,
                                is_logged_in: 1,
                                access_level: dbresult.access_level,
                                token: genToken(dbresult.id)
                            };
                            let update_object = {
                                token: response.token
                            };
                            let sql = "UPDATE `mr-epoxy`.member SET date_last_login=now(), is_logged_in=1, ? WHERE id=?;";
                            db.query(sql, [update_object, response.user_id], (error, result) => {
                                if (error) {
                                    resolve(error);
                                }
                                else {
                                    resolve(response);
                                }
                            }, (error) => {
                                reject(error);
                            });
                            
                        }
                    }
                });

            }
		});
    }
    

    function insert(insert_object) {
        return new Promise((resolve, reject) => {
            let sql = "INSERT INTO `mr-epoxy`." + insert_object.table + " SET ?;";
            db.query(sql, insert_object.values, (error, result) => {
                if(error) {
                    reject(error);
                }
                else {
                    resolve(result);
                }
            });
        });
    }

	function update(table, id, update_object) {
		return new Promise((resolve, reject) => {
			let sql = "UPDATE `mr-epoxy`." + table + " ";
			sql += "SET ? ";
			sql += "WHERE id = " + id + ";";
			try {
				db.query(sql, update_object, function (error, result) {
					if (error) {
						let response = {};
						response.error = error;
						resolve(response);
					}
					else {
						resolve(result);
					}
				});
			}
			catch (error) {
				reject(error);
			}
		});
    }
 
    function userSearch(key, value) {

        let sql = "SELECT * FROM `mr-epoxy`.member WHERE ";
        if(key == 'username' || key == 'email') {
            sql = sql + key + "='" + value + "' OR email='" + value + "';";
        }
        else {
            sql = sql + key + "='" + value + "';";
        }

        return new Promise((resolve, reject) => {
            try {
                db.query(sql, (error, result) => {
                    if (error) {
                        let response = {};
                        response.error = error;
                        resolve(response);
                    }
                    else {
                        if(result.length > 0) {
                            resolve([{ 
                                id: result[0].id,
                                username: result[0].username,
                                verify: result[0].verified
                            }]);
                        }
                        else {
                            resolve(false);
                        }
                        
                    }
                });
            }
            catch (error) {
                reject(error);
            }
        });
    }

    function updateUnassignedInvoices(inv,  id) {

        let sql = "UPDATE `mr-epoxy`.customer SET invoice = " + inv + " WHERE member_id = " + id + " AND invoice = 0;";
        return new Promise((resolve, reject) => {
            try {
                db.query(sql, (error, result) => {
                    if (error) {
                        let response = {};
                        response.error = error;
                        resolve(response);
                    }
                    else {
                        resolve(result);
                    }
                });
            }
            catch (error) {
                reject(error);
            }
        });

    }
    
    function getInvoice(id, key, invoice) {
        return new Promise((resolve, reject) => {
            let sql = "SELECT * FROM `mr-epoxy`.customer" + " WHERE `member_id` = ? AND `key` = ? AND `invoice` = ?;";
            try {
                db.query(sql, [id, key, invoice], (error, result) => {
                    if (error) {
                        let response = {};
                        response.error = error;
                        resolve(response);
                    }
                    else {

                        resolve(result);
                    }
                });
            }
            catch(error) {
                reject(error);
            }
        });



    }

	function search(table, search_object, token, id) {

		return new Promise((resolve, reject) => {
            verifyToken(table, token, (error) => { reject(error); })
			    .then(showColumns, (error) => { reject(error); })
				.then(buildQuery, (error) => { reject(error); })
				.then(select, (error) => { reject(error); })
				.then((result) => { resolve(result); }, (error) => { reject(error); });
        });
        
        function verifyToken(table, token) {
            return new Promise((resolve, reject) => {
                let sql = "SELECT `token` FROM `mr-epoxy`.member WHERE id = " + id + ";";
                db.query(sql, (error, result) => {
                    if(error) {
                        reject(error);
                    }
                    else {
                        resolve(table);
                    }
                })
            });
        }

		function showColumns(table) {

			return new Promise((resolve, reject) => {
				let sql = "SHOW COLUMNS FROM `mr-epoxy`." + table + ";";
				try {
					db.query(sql, (error, result) => {
						if (error) {
							let response = {};
							response.error = error;
							resolve(response);
						}
						else {
							resolve(result);
						}
					});
				}
				catch (error) {
					reject(error);
				}
			});

		}

		function buildQuery(col_props) {

			return new Promise((resolve) => {
                let where_str = '';
                if(!search_object.all_cols) {
                    Object.keys(search_object).forEach((key) => {
                        let field_type = findFieldType(col_props, key);
                        where_str += (where_str.length > 0) ? where_str + ", " : " WHERE ";
                        if (field_type == 'blob' ||
                            field_type == 'char' ||
                            field_type == 'date' ||
                            field_type == 'datetime' ||
                            field_type == 'text' ||
                            field_type == 'timestamp' ||
                            field_type.startsWith('varchar') ||
                            field_type == 'year') {
                            where_str += key + "='" + search_object[key] + "'";
                        }
                        else {
                            where_str += key + "=" + search_object[key];
                        }
    
                    });
                    
                }
                let query = "SELECT * FROM `mr-epoxy`." + table + where_str + ";";
                resolve(query);

			});

		}

		function select(sql_query) {

			return new Promise((resolve, reject) => {
				let response = {};
				try {
					db.query(sql_query, (error, result) => {
						if (error) {
							response.error = 'Server Error: ' + error;
							resolve(response);
						}
						else {
							let cleaned = cleanPasswords(result);
							resolve(cleaned);
						}
					});
				}
				catch (error) {
					reject(error);
				}

			});

		}

		function findFieldType(properties, field) {

			let response = null;
			let fndFld = function (data) {
				return data.Field == field;
			};
			let i = properties.findIndex(fndFld);
			if (i >= 0) {
				response = properties[i].Type;
			}
			return response;

		}

	}


	/**
	 * register
	 * @param {Object} member: member dataset
	 * @return {Promise} insert result
	 */
	function register(member) {
		
		let promise = new Promise((resolve, reject) => {
			bcrypt.genSalt(10, function (error, salt) {
				bcrypt.hash(member.password, salt, function (error, hash) {
					let insert_object = {
						password: hash,
						email: member.email,
						username: member.username,
						access_level: 1,// limited access until upgrade level.
						reg_code: salt.replace('/', '')
					};
					var sql = "INSERT INTO `mr-epoxy`.member SET ?;";
					try {
						db.query(sql, insert_object, function (error, result) {
							if (error) {
								let response = {};
								response.error = error;
								resolve(response);
							}
							else {
                                emailer.SendCode(member.email, insert_object.reg_code);
								resolve(result);
							}
						});
					}
					catch (error) {
						reject(error);
					}
				});
			});
		});
		return promise;

    }
    
	function getProducts() {

		return new Promise((resolve, reject) => {
			let sql = "SELECT * FROM `mr-epoxy`.product;";
			try {
				db.query(sql, (error, result) => {
					if (error) {
						reject(error);
					}
					else {
						resolve(result);
					}
				});
			}
			catch (error) {
				reject(error);
			}
		});

    }
    
    function removeCartItem(id) {
        return new Promise((resolve, reject) => {
            let sql = "DELETE FROM `mr-epoxy`.customer WHERE id=?";
            try {
				db.query(sql, [id], (error, result) => {
					if (error) {
						reject(error);
					}
					else {
						resolve(result);
					}
				});
			}
			catch (error) {
				reject(error);
            }
        });
    }

};

// private methods

/**
 * genToken
 * @param {Integer} id of user
 * @return {Object} token
 */
function genToken(id) {

    let expires = expiresIn(1); // 1 day
	let token = jwt.encode({
		exp: expires,
		id: id
	}, require('../secret.js')());
	let token_obj = {
		key: token,
		expires: expires,
		id: id
	};
	return token_obj;

}

/**
 * expiresIn
 * @param {Integer} num_days - number of days
 */
function expiresIn(num_days) {
	var dateObj = new Date();
	return dateObj.setDate(dateObj.getDate() + num_days);
}

/**
 * cleanPasswords
 */
function cleanPasswords(db_array) {
	db_array.forEach((dataset, i, array) => {
		if (dataset.password) {
			delete array[i].password;
		}
		if (dataset.reg_code) {
			delete array[i].reg_code;
		}
	});
	return db_array;
}
