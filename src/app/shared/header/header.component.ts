import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Usuario } from 'src/app/models/usuario.model';
import { UsuarioService } from 'src/app/services/usuario.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  public usuario: Usuario;
  constructor(private usuariosService: UsuarioService,
              private router: Router) {
    this.usuario = usuariosService.usuario;
   }

  ngOnInit(): void {
  }

  logout(){
    this.usuariosService.logout();
  }
}
