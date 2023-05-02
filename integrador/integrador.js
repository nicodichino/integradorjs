class Producto {
    sku;            // Identificador único del producto
    nombre;         // Su nombre
    categoria;      // Categoría a la que pertenece este producto
    precio;         // Su precio
    stock;          // Cantidad disponible en stock

    constructor(sku, nombre, precio, categoria, stock) {
        this.sku = sku;
        this.nombre = nombre;
        this.categoria = categoria;
        this.precio = precio;

        // Si no me definen stock, pongo 10 por default
        if (stock) {
            this.stock = stock;
        } else {
            this.stock = 10;
        }
    }

}

const queso = new Producto('KS944RUR', 'Queso', 10, 'lacteos', 4);
const gaseosa = new Producto('FN312PPE', 'Gaseosa', 5, 'bebidas');
const cerveza = new Producto('PV332MJ', 'Cerveza', 20, 'bebidas');
const arroz = new Producto('XX92LKI', 'Arroz', 7, 'alimentos', 20);
const fideos = new Producto('UI999TY', 'Fideos', 5, 'alimentos');
const lavandina = new Producto('RT324GD', 'Lavandina', 9, 'limpieza');
const shampoo = new Producto('OL883YE', 'Shampoo', 3, 'higiene', 50);
const jabon = new Producto('WE328NJ', 'Jabon', 4, 'higiene', 3);

const productosDelSuper = [queso, gaseosa, cerveza, arroz, fideos, lavandina, shampoo, jabon];

class Carrito {
    productos;      // Lista de productos agregados
    categorias;     // Lista de las diferentes categorías de los productos en el carrito
    precioTotal;    // Lo que voy a pagar al finalizar mi compra

    // Al crear un carrito, empieza vació
    constructor() {
        this.precioTotal = 0;
        this.productos = [];
        this.categorias = [];
    }

    /**
     * función que agrega @{cantidad} de productos con @{sku} al carrito
     */
    async agregarProducto(sku, cantidad) {
        
        console.log(`Agregando ${cantidad} ${sku}`);
      
        // Busco el producto en la "base de datos"
        const producto = await findProductBySku(sku);

        console.log("Producto encontrado", producto);
      
        // Busco si el producto ya está en el carrito
        const productoExistente = this.productos.find((p) => p.sku === sku);
      
        if (productoExistente) {
          // Si el producto ya existe, actualizo la cantidad y el precio total
          productoExistente.cantidad += cantidad;
          this.precioTotal += producto.precio * cantidad;
        } else {
          // Si el producto no existe, lo agrego como un nuevo producto
          const nuevoProducto = new ProductoEnCarrito(sku, producto.nombre, cantidad);
          this.productos.push(nuevoProducto);
          this.precioTotal += producto.precio * cantidad;
      
          // Verifico si la categoría del producto ya está en el carrito
          if (!this.categorias.includes(producto.categoria)) {
            this.categorias.push(producto.categoria);
          }
        }
      }
      
        eliminarProducto(sku, cantidad) {
        return new Promise((resolve, reject) => {
        // Busca si el producto está en el carrito
        const productoExistenteIndice = this.productos.findIndex(
            (p) => p.sku === sku
        );
        if(productoExistenteIndice === -1) {
            // Si no existe muestro un mensaje de error y rechazo la promesa
            reject(`No existe el producto con SKU ${sku} en el carrito`);

        } 
        
        else {
            const productoExistente = this.productos[productoExistenteIndice];

            if (cantidad >= productoExistente.cantidad) {
                // Si la cantidad es > o = elimino el producto del carrito
                this.productos.splice(productoExistenteIndice, 1);
                this.precioTotal -= productoExistente.precio * productoExistente.cantidad;

            } 
            
            else {
                // Si la cantidad es menor, resto la cantidad y el precio total
                productoExistente.cantidad -= cantidad;
                this.precioTotal -= productoExistente.precio * cantidad;
            }
      
            resolve(`Producto con SKU ${sku} eliminado del carrito`);
            
        }
        });

    }

}

    


class ProductoEnCarrito {
    sku;       // Identificador único del producto
    nombre;    // Su nombre
    cantidad;  // Cantidad de este producto en el carrito

    constructor(sku, nombre, cantidad) {
        this.sku = sku;
        this.nombre = nombre;
        this.cantidad = cantidad;
    }

}

function findProductBySku(sku) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            try {
                const foundProduct = productosDelSuper.find(product => product.sku === sku);
                if (foundProduct) {
                  resolve(foundProduct);
                } else {
                  throw new Error(`No me rompas :( Product ${sku} not found`);
                }
              } catch (error) {
                reject(error.message);
              }
            }, 1500);
          });
}



const carrito = new Carrito();

carrito.agregarProducto('WE328NJ', 2)
// Dejo en consola mostrando que se crea el carrito y se elimina una unidad de las que se agregaron, probé el error y me lo devuelve tambien
    .then(() => {
    console.log(`Producto agregado`);
    return carrito.eliminarProducto('WE328NJ', 1);
    })
  .then((mensaje) => console.log(mensaje))
  .catch((error) => console.error(error));


