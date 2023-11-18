import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

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
    
  }
}
