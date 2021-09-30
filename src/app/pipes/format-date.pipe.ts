import { Pipe, PipeTransform } from '@angular/core'; 

@Pipe({ 
  name: 'formatDate' 
}) 
export class FormatDatePipe implements PipeTransform { 
  transform(value: any, args?: any): any { 
    if (value !== null) { 
      const result = value.replace(/^(\d{4})(\d{2})(\d{2})$/g,'$1/$2/$3'); 
      return result;   
    } else { 
      const result = '--'; 
      return result; 
    } 
  } 
 
} 

 
 

 