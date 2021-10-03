import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';

import { Usuario } from '../../models/usuario.model';

import Swal from 'sweetalert2';

import { UsuarioService } from '../../services/usuario.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';

import { MatSort } from '@angular/material/sort';
@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss'],
})
export class UsersComponent implements OnInit, AfterViewInit {
  public displayedColumns: string[] = [
    'position',
    'nombre',
    'email',
    'role',
    'auth',
    'acciones',
  ];
  public totalUsuarios: number = 0;
  public usuarios: Usuario[] = [];
  public usuariosTemp: Usuario[] = [];
  public desde: number = 0;
  public cargando: boolean = true;
  public usuarioParent: any;
  public isEditar = false;
  public dataSource = new MatTableDataSource<Usuario>(this.usuarios);
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(private usuariosServices: UsuarioService) {
    // const users = Array.from({length: 100}, (_, k) => createNewUser(k + 1));
    this.dataSource = new MatTableDataSource(this.usuarios);
  }
  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }
  ngOnInit(): void {
    this.cargarUsuarios();
  }

  cargarUsuarios() {
    this.cargando = true;
    this.usuariosServices.cargarUsuarios().subscribe(({ total, usuarios }) => {
      this.totalUsuarios = total;
      this.dataSource.data = usuarios;
      console.log(this.dataSource.data);
      console.log(this.usuarios);
      this.usuarios = usuarios;
      this.usuariosTemp = usuarios;
      this.cargando = false;
    });
  }

  cambiarPagina(valor: number) {
    this.desde += valor;
    if (this.desde < 0) {
      this.desde = 0;
    } else if (this.desde >= this.totalUsuarios) {
      this.desde -= valor;
    }

    this.cargarUsuarios();
  }

  eliminarUsuario(usuario: Usuario): any {
    if (usuario.uid === this.usuariosServices.uid) {
      return Swal.fire('Error', 'No puede borrarse a si mismo', 'error');
    }

    Swal.fire({
      title: 'Eliminar usuario?',
      text: `Esta a punto de eliminar a ${usuario.nombre}`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Si, eliminar!',
    }).then((result) => {
      if (result.isConfirmed) {
        this.usuariosServices.eliminarUsuario(usuario).subscribe((res) => {
          this.cargarUsuarios();
          Swal.fire(
            'Eliminado!',
            `${usuario.nombre} fue eliminado correctamente`,
            'success'
          );
        });
      }
    });
  }

  cambiarRole(usuario: Usuario): any {
    this.usuariosServices.guardarUsuario(usuario).subscribe((res: any) => {});
  }

  openModalEditar(usuario: Usuario, idx: number): void {
    this.usuarioParent = { usuario, idx };
  }

  addItem(mensaje: string): any {
    Swal.fire({
      title: 'Editar usuario?',
      text: `Esta a punto de editar a ${this.usuariosServices.usuario.nombre}`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Si, editar!',
    }).then((result) => {
      if (result.isConfirmed) {
        this.usuariosServices
          .guardarUsuario(this.usuariosServices.usuario)
          .subscribe((res) => {
            this.cargarUsuarios();
            Swal.fire(
              'Editado!',
              `${this.usuariosServices.usuario.nombre} ${mensaje}`,
              'success'
            );
          });
      }
    });
  }
}
