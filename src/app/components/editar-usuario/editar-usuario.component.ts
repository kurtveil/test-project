import { Component, Input, OnChanges, OnInit, SimpleChanges,  Output, EventEmitter  } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Usuario } from 'src/app/models/usuario.model';
import { UsuarioService } from 'src/app/services/usuario.service';
@Component({
  selector: 'app-editar-usuario',
  templateUrl: './editar-usuario.component.html',
  styleUrls: ['./editar-usuario.component.scss'],
})
export class EditarUsuarioComponent implements OnInit, OnChanges {
  public usuarioChild: Usuario;
  usuarioForm: FormGroup;
  @Input() dataUser: Usuario;
  @Output() newItemEvent = new EventEmitter<string>();
  constructor(
    private userService: UsuarioService
    ) {
      this.usuarioForm = new FormGroup({
        nombre: new FormControl('', [Validators.required]),
        email: new FormControl('', [Validators.required]),
      });
    }
    

  ngOnInit(): void {}

  ngOnChanges(changes: SimpleChanges){
    if(changes.dataUser.currentValue !== undefined){
      this.usuarioChild =  changes.dataUser.currentValue.usuario;
      this.usuarioForm.patchValue({nombre: this.usuarioChild.nombre, email: this.usuarioChild.email})
    } else if (changes.dataUser.currentValue === undefined){return;}
  }
  guardarData() {
    this.usuarioChild.nombre = this.usuarioForm.value.nombre;
    this.usuarioChild.email = this.usuarioForm.value.email;
    this.userService.saveData(this.usuarioChild);
    this.newItemEvent.emit('fue editado correctamente');
  }


}
