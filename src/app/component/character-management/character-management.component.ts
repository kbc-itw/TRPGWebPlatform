import { Component, OnInit } from '@angular/core';
import { CharacterManagementService } from '../../Service/character-management.service';

@Component({
  selector: 'app-character-management',
  templateUrl: './character-management.component.html',
  styleUrls: ['./character-management.component.css']
})
export class CharacterManagementComponent implements OnInit {
  side_flg: boolean = false;
  constructor(private charamana: CharacterManagementService) { }

  ngOnInit() {
    /*
    if (window.File && window.FileReader && window.FileList && window.Blob) {
      alert('未');
    } else {
      alert('未対応');
    }
    */
  }

  test(a) {
    console.log(a.root.getFile('character-create.component.html', {create: true, exclusive: true}));
  }
}

