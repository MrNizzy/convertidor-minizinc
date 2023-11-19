import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

interface CantidadElementos {
  productos: number;
  materias_primas: number;
}

interface Producto {
  nombre_variable: string;
  precio_venta: number;
  precio_neto: number;
  materias_primas: number[];
}

interface MateriaPrima {
  nombre_variable: string;
  precio: number;
  cantidad_max: number;
}

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, ReactiveFormsModule, FormsModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  codigo = '';
  conversion = '';
  code: string[] = [];
  cantidadElementos: CantidadElementos = {
    productos: 0,
    materias_primas: 0,
  };
  productos: Producto[] = [];
  materias_primas: MateriaPrima[] = [];

  /**
   * Muestra un ejemplo de código en la variable "codigo".
   */
  showEjemplo(): void {
    this.codigo = `4\n3\nGrasa_azul 20000 2 3 9\nGrasa_amarilla 50000 3 9 9\nGrasa_negra 30000 2 0 4\nGrasa_blanca 30000 1 2 0\nMateria_prima_1 1000 300\nMateria_prima_2 2500 400\nMateria_prima_3 4000 520`;
  }

  /**
   * Genera el código de MiniZinc correspondiente a las restricciones y variables definidas.
   */
  generarMinizinc(): void {
    this.productos = [];
    this.materias_primas = [];
    this.conversion = '';
    // TODO: Separa los primeros dos valores con salto de línea y guardalos en code.
    this.code = this.codigo.split('\n');
    this.cantidadElementos.productos = parseInt(this.code[0]);
    this.cantidadElementos.materias_primas = parseInt(this.code[1]);
    if (
      !this.cantidadElementos.productos ||
      !this.cantidadElementos.materias_primas
    ) {
      this.conversion = 'Error en la cantidad de productos o materias primas';
      return;
    }
    // TODO: Elimina los dos primeros valores de code, luego la cantidad de productos se agregaran a la variable productos desde code iterando en cantidadElementos.productos.
    this.code.splice(0, 2);
    this.productos = [];
    for (let i = 0; i < this.cantidadElementos.productos; i++) {
      let tempVariables = this.code[0].split(' ');
      this.productos.push({
        nombre_variable: tempVariables[0],
        precio_venta: parseInt(tempVariables[1]),
        precio_neto: 0,
        materias_primas: [],
      });
      // Guardar el resto de code[0].split() en productos[i].materias_primas
      tempVariables.splice(0, 2);
      // Convertir los valores de tempVariables a enteros
      let tempEnteros = tempVariables.map((e) => parseInt(e));

      this.productos[i].materias_primas = tempEnteros;

      this.code.splice(0, 1);
    }

    this.code.map((e) => {
      let tempVariables = e.split(' ');
      this.materias_primas.push({
        nombre_variable: tempVariables[0],
        precio: parseInt(tempVariables[1]),
        cantidad_max: parseInt(tempVariables[2]),
      });
    });

    if (
      this.productos.length != this.cantidadElementos.productos ||
      this.materias_primas.length != this.cantidadElementos.materias_primas
    ) {
      this.conversion = 'Error en la cantidad de productos o materias primas';
      return;
    }

    // agregar precio neto, al precio de venta se le resta el costo de las materias por producto
    this.productos.map((e) => {
      e.precio_neto = e.precio_venta;
      for (let i = 0; i < e.materias_primas.length; i++) {
        e.precio_neto -= this.materias_primas[i].precio * e.materias_primas[i];
      }
    });

    this.conversion += `var int: gananciaTotal = `;

    for (let i = 0; i < this.productos.length; i++) {
      if (i != 0) this.conversion += ` + `;
      this.conversion += `${this.productos[i].precio_neto} * ${this.productos[i].nombre_variable}`;
    }

    this.conversion += `;\n\n`;

    this.productos.map((e) => {
      this.conversion += `var int: ${e.nombre_variable};\n`;
    });

    this.conversion += `\n`;

    this.productos.map((e) => {
      this.conversion += `constraint ${e.nombre_variable} >= 0;\n`;
    });

    this.conversion += `\n`;

    // TODO: Agregar restricciones de cantidad de materias primas
    for (let i = 0; i < this.materias_primas.length; i++) {
      this.conversion += `constraint `;
      for (let j = 0; j < this.productos.length; j++) {
        if (j != 0) this.conversion += ` + `;
        this.conversion += `${this.productos[j].materias_primas[i]} * ${this.productos[j].nombre_variable}`;
      }
      this.conversion += ` <= ${this.materias_primas[i].cantidad_max};\n`;
    }

    this.conversion += `\nsolve maximize gananciaTotal;\n\n`;
    this.productos.map((e) => {
      this.conversion += `output ["${e.nombre_variable} = ", show(${e.nombre_variable}), "\\n"];\n`;

    });
    this.conversion += `output ["Ganancia total = ", show(gananciaTotal)];`;

    console.table(this.materias_primas);
    console.table(this.cantidadElementos);
    console.table(this.productos);
  }

  copyToClipboard(text: string): void {
    navigator.clipboard.writeText(text);
  }
}
