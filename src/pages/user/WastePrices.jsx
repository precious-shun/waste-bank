import { collection, getDocs } from "firebase/firestore";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { db } from "../../services/firebase";
import { Button, Typography, TextField, Box } from "@mui/material";
import { theme } from "../../theme";
import Navbar from "../../components/Navbar";

const colors = {
  darkGreen: "#2C514B",
  green: "#4E7972",
  lightGreen: "#C2D1C8",
  orange: "#D66C42",
  lightGrey: "#ebebeb",
  white: "#ffffff",
};

const WastePrices = () => {
  const { setValue, watch } = useForm({
    defaultValues: { waste_products: [], total: 0 },
  });

  const [wasteProducts, setWasteProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const wasteCollection = await getDocs(collection(db, "waste-products"));
      setWasteProducts(
        wasteCollection.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
      );
    };
    fetchData();
  }, []);

  const toggleProduct = (id) => {
    let updatedCart = [...cart];
    const existingProduct = updatedCart.find((p) => p.waste_product_id === id);
    if (existingProduct) {
      updatedCart = updatedCart.filter((p) => p.waste_product_id !== id);
    } else {
      const product = wasteProducts.find((wp) => wp.id === id);
      updatedCart.push({
        waste_product_id: id,
        quantity: 1,
        subtotal: product.price,
      });
    }
    setCart(updatedCart);
    setValue("waste_products", updatedCart);
    setValue(
      "total",
      updatedCart.reduce((acc, item) => acc + item.subtotal, 0)
    );
  };

  const updateQuantity = (id, quantity) => {
    const updatedCart = cart.map((p) => {
      if (p.waste_product_id === id) {
        const product = wasteProducts.find((wp) => wp.id === id);
        return { ...p, quantity: quantity, subtotal: product.price * quantity };
      }
      return p;
    });
    setCart(updatedCart);
    setValue("waste_products", updatedCart);
    setValue(
      "total",
      updatedCart.reduce((acc, item) => acc + item.subtotal, 0)
    );
  };

  return (
    <Box sx={{ backgroundColor: colors.lightGrey, minHeight: "100vh" }}>
      <Navbar />
      <div className="min-h-screen bg-gray-100 p-6">
        <div className="container mx-auto max-w-6xl">
          <div className="flex flex-col lg:flex-row gap-8">
            <div className="w-full lg:w-2/3">
              <span className="text-2xl text-green-900 font-medium">
                Choose Waste Products
              </span>

              <div className="grid mt-4 grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {wasteProducts.map((wp) => (
                  <div
                    key={wp.id}
                    className={`border-2 rounded-xl p-4 cursor-pointer transition-all duration-200 bg-lightgreen ${cart.some((item) => item.waste_product_id === wp.id) ? "bg-normalgreen text-white" : "border-gray-200 text-teal-800 hover:border-gray-400"}`}
                    onClick={() => toggleProduct(wp.id)}
                  >
                    <div className="text-center flex flex-col gap-1">
                      <span className="font-medium  mb-1">{wp.waste}</span>
                      <span className="">Rp {wp.price.toLocaleString()}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="lg:w-1/3 w-full mt-12">
              <div className="border rounded-lg shadow-sm lg:relative fixed bottom-0 left-0 right-0 z-10 lg:z-0">
                <div
                  className="bg-white rounded-lg p-4 border-b cursor-pointer  hover:bg-gray-50 transition-colors lg:block hidden "
                  onClick={() => setIsCartOpen(!isCartOpen)}
                >
                  <Typography variant="h6" className="text-gray-800">
                    Stash Simulation
                  </Typography>
                </div>

                <div
                  className="lg:hidden flex items-center justify-between bg-normalgreen text-white p-4 cursor-pointer "
                  onClick={() => setIsCartOpen(!isCartOpen)}
                >
                  <Typography variant="h6">Cart</Typography>
                </div>

                {isCartOpen && (
                  <div className="bg-white rounded-b-lg">
                    <div className="max-h-[50vh] overflow-y-auto p-4">
                      {cart.length === 0 ? (
                        <Typography
                          variant="body2"
                          className="text-center text-gray-500 py-4"
                        >
                          Empty Cart
                        </Typography>
                      ) : (
                        <div className="space-y-3">
                          {cart.map((item) => {
                            const product = wasteProducts.find(
                              (wp) => wp.id === item.waste_product_id
                            );
                            return (
                              <div
                                key={item.waste_product_id}
                                className="flex items-center justify-between  border rounded p-3 bg-gray-50"
                              >
                                <div>
                                  <Typography
                                    variant="body1"
                                    className="font-medium"
                                  >
                                    {product?.waste}
                                  </Typography>
                                  <Typography
                                    variant="body2"
                                    className="text-gray-600"
                                  >
                                    Rp {item.subtotal.toLocaleString()}
                                  </Typography>
                                </div>

                                <div className="flex items-center">
                                  <TextField
                                    type="number"
                                    size="small"
                                    value={item.quantity}
                                    onChange={(e) =>
                                      updateQuantity(
                                        item.waste_product_id,
                                        parseInt(e.target.value)
                                      )
                                    }
                                    inputProps={{ min: 1 }}
                                    className="w-20"
                                  />
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>

                    <div className="p-4 border-t">
                      <div className="flex justify-between mb-4">
                        <Typography variant="body1" className="font-medium">
                          Total:
                        </Typography>
                        <Typography
                          variant="body1"
                          className="text-gray-800 font-medium"
                        >
                          Rp{watch("total").toLocaleString()}
                        </Typography>
                      </div>
                      <Button
                        onClick={() => {
                          setCart([]);
                          setValue("total", 0);
                        }}
                        sx={{
                          backgroundColor: theme.green,
                          borderRadius: "10px",
                        }}
                        variant="contained"
                        fullWidth
                        disabled={cart.length === 0}
                      >
                        Reset
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Box>
  );
};

export default WastePrices;
