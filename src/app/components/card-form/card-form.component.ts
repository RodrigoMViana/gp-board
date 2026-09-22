import { Component, inject } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';

import { BoardService } from '../../services/board.service';

@Component({
  selector: 'app-card-form',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './card-form.component.html',
  styleUrl: './card-form.component.css',
})
export class CardFormComponent {
  private readonly fb = inject(FormBuilder);
  private readonly svc = inject(BoardService);

  readonly form = this.fb.nonNullable.group({
    title: ['', [Validators.required, Validators.minLength(3)]],
    owner: ['', [Validators.required]],
    value: [0, [Validators.required, Validators.min(0)]],
  });

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.svc.addCard(this.form.getRawValue());
    this.form.reset({ title: '', owner: '', value: 0 });
  }
}
