/**
 * Order endpoint related to order activities
 */
var Order = {};

Order.init = function(server, database, Authenticate)
{
    // Get all order for the registered user
    server.get("orders", Authenticate.customer, function(req, res, next)
    {
        var user_id = Authenticate.decodetoken(req.authorization.credentials).payload.iss;

        database.executeQuery("SELECT * FROM `order` WHERE user_id = ? ORDER BY order_number DESC", [user_id], function (result, error)
        {
            if (error)
            {
                res.send(500, error);
            }
            else
            {
                res.send(result);
            }
        });

        next();
    });

    // Get one specific order for the registered user
    server.get("orders/:order_number", Authenticate.customer, function(req, res, next)
    {
        var user_id = Authenticate.decodetoken(req.authorization.credentials).payload.iss;

        database.executeQuery("SELECT * FROM `order` WHERE user_id = ? AND order_number = ?", [user_id, req.params.order_number], function(result, error)
        {
            if (error)
            {
                res.send(500, error);
            }
            else if (result.length < 1)
            {
                res.send(404, "Order not found");
            }
            else
            {
                var order = result[0];
                
                database.executeQuery("SELECT * FROM `game` g JOIN `orders_contain_games` ocg ON g.ean_number = ocg.ean_number JOIN `platform_independent_info` pi ON g.pi_id = pi.pi_id WHERE ocg.user_id = ? AND ocg.order_number = ?", [user_id, req.params.order_number], function(products, error)
                {
                    if (error)
                    {
                         res.send(500, error)
                    }
                    else
                    {
                        order.products = products;
                        
                        res.send(order)
                    }
                 });
            }
        });
    });

    // Create a new order
    server.post("orders", Authenticate.customer, function(req, res, next)
    {
        // Parse body to JSON
        req.body = JSON.parse(req.body);

        // Append the user_id to the req.body
        var user_id = Authenticate.decodetoken(req.authorization.credentials).payload.iss;
        req.body.user_id = user_id;

        // Insert the orer in the database (without cart)
        var order_body = Object.assign({}, req.body);
        delete order_body.cart;

        database.executeQuery("INSERT INTO `order` SET ?", [order_body], function(result, error)
        {
            if (error)
            {
                res.send(500, error);
            }
            else
            {
                var order_number = result.insertId;

                // Add all products in the cart to the order
                for (i = 0; i < req.body.cart.length; i ++)
                {
                    var order_content          = req.body.cart[i];
                    order_content.user_id      = req.body.user_id;
                    order_content.order_number = order_number;

                    delete order_content.title;
                    delete order_content.image;
                    delete order_content.price;

                    database.executeQuery("INSERT INTO `orders_contain_games` SET ?", [order_content], function(result, error, fields)
                    {
                        if (error)
                        {
                            // Check if we get a DUPLICATED_KEY error, in that case we can just increase the amount with + 1
                            if (error.errno == 1062)
                            {
                                database.executeQuery("UPDATE `orders_contain_games` SET amount = amount + 1 WHERE ean_number = ? AND order_number = ?", [order_content.ean_number, order_content.order_number], function(result, error)
                                {
                                    if (error)
                                    {
                                        res.send(500, error);
                                    }
                                });
                            }
                        }
                            
                        // Update total order_price
                        database.executeQuery("UPDATE `order` SET total_order_price = (SELECT ROUND(SUM(g.price * ocg.amount), 2) FROM `orders_contain_games` ocg JOIN `game` g ON g.ean_number = ocg.ean_number WHERE ocg.order_number = ?) WHERE order_number = ?", [order_number, order_number], function(result, error)
                        {
                            if (error)
                            {
                                res.send(500, error)
                            }
                        });
                    });
                }

                res.send("Order created");
            }
        })
    });

    // Add new products to a order
    server.post("orders/:order_number/products", Authenticate.customer, function(req, res, next)
    {
        // Append user_id and order_number to req.body
        var user_id = Authenticate.decodetoken(req.authorization.credentials).payload.iss;

        req.body.user_id = user_id;
        req.body.order_number = req.params.order_number;

        database.executeQuery("INSERT INTO `orders_contain_games` SET ?", [req.body], function(result, error, fields)
        {
            if (error)
            {
                // Check if we get a DUPLICATED_KEY error, in that case we can just increase the amount with + 1
                if (error.errno == 1062)
                {
                    database.executeQuery("UPDATE `orders_contain_games` SET amount = amount + 1 WHERE ean_number = ? AND order_number = ?", [req.body.ean_number, req.params.order_number], function(result, error)
                    {
                        if (error)
                        {
                            res.send(500, error);
                        }
                    });
                }
            }

            // Update the total order price
            database.executeQuery("UPDATE `order` SET total_order_price = (SELECT SUM(g.price * ocg.amount) FROM `orders_contain_games` ocg JOIN `game` g ON g.ean_number = ocg.ean_number WHERE ocg.order_number = ?) WHERE order_number = ?", [req.params.order_number, req.params.order_number], function(result, error)
            {
                if (error)
                {
                    res.send(500, error)
                }
                else
                {
                    res.send("Product add to order");
                }
            });
        });
    });

    // Update a order for the registered user
    server.patch("orders/:order_number", Authenticate.customer, function(req, res, next)
    {
        var user_id = Authenticate.decodetoken(req.authorization.credentials).payload.iss;

        database.executeQuery("UPDATE `order` SET ? WHERE order_number = ?", [req.body, req.params.order_number], function(result, error, fields)
        {
            if (error)
            {
                res.send(500, error);
            }
            else
            {
                res.send("Order updated")
            }
        });
    });

    // Delete products from a order for a registered user
    server.del("orders/:order_number/products/:ean_number", Authenticate.customer, function(req, res, next)
    {
        var user_id = Authenticate.decodetoken(req.authorization.credentials).payload.iss;

        database.executeQuery("SELECT amount FROM `orders_contain_games` WHERE order_number = ? AND ean_number = ?", [req.params.order_number, req.params.ean_number], function(result, error)
        {
            if (error)
            {
                res.send(500, error);
            }
            else if (result == undefined || result.length == 0)
            {
                res.send(404, "Product not found in order")
            }
            else if (result[0].amount == 1)
            {
                database.executeQuery("DELETE FROM `orders_contain_games` WHERE user_id = ? AND order_number = ? AND ean_number = ?", [user_id, req.params.order_number, req.params.ean_number], function(result, error, fields)
                {
                    if (error)
                    {
                        res.send(500, error)
                    }
                    else
                    {
                        res.send("Product deleted from order");
                    }
                });
            }
            else
            {
                database.executeQuery("UPDATE `orders_contain_games` SET amount = amount - 1 WHERE order_number = ? AND ean_number = ?", [req.params.order_number, req.params.ean_number], function(result, error) {
                    if (error)
                    {
                        res.send(500, error)
                    }
                    else
                    {
                        res.send("Product deleted from order");
                    }
                });
            }

            database.executeQuery("UPDATE `order` SET total_order_price = (SELECT SUM(g.price * ocg.amount) FROM `orders_contain_games` ocg JOIN `game` g ON g.ean_number = ocg.ean_number WHERE ocg.order_number = ?) WHERE order_number = ?", [req.params.order_number, req.params.order_number], function(result, error)
            {
                if (error)
                {
                    res.send(500, error)
                }
            });
        });
    });
}

module.exports = function (server, databaseHelper, authenticateHelper)
{
    return Order.init(server, databaseHelper, authenticateHelper);
}