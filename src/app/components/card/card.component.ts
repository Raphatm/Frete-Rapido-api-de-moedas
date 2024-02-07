import { Component, OnInit } from '@angular/core';
import { MoedasService } from 'src/app/services/moedas.service';
import { Observable, timer } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { MoedasData, Moeda } from '../models/moedasData';

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.css', 'card-mobile.component.css'],
})
export class CardComponent implements OnInit {
  moedas$!: Observable<MoedasData>;
  moedasSelecionadas: Moeda[] = [];
  errorOccurred: boolean = false;
  loading: boolean = false;

  constructor(private service: MoedasService) {}

  ngOnInit(): void {
    const refreshInterval$ = timer(0, 3 * 60 * 1000);

    this.moedas$ = refreshInterval$.pipe(
      switchMap(() => {
        const timestamp = new Date().getTime();
        return this.service.getMoeda(
          `CAD-BRL,ARS-BRL,GBP-BRL?timestamp=${timestamp}`
        );
      })
    );

    this.moedas$.subscribe({
      next: (dados) => {
        if (typeof dados === 'object' && dados !== null) {
          const moedasArray = Object.values(dados);
          this.moedasSelecionadas = moedasArray.filter((moeda) =>
            this.isMoedaValida(moeda)
          );
          this.errorOccurred = false; // Reset do erro (se colocar aqui como true vc consegue ver o erro e a sequencia de loading. Só não esquece de reverter depois de usar.)
          this.loading = false; // Desativa o indicador de carregamento
        } else {
          console.error('Dados recebidos não são um objeto:', dados);
          this.errorOccurred = true;
          this.loading = false;
        }
      },
      error: (error) => {
        console.error('Ocorreu um erro ao obter os dados:', error);
        this.errorOccurred = true;
        this.loading = false;
      },
    });
  }

  reload() {
    this.loading = true; // Ativa o indicador de carregamento
    this.errorOccurred = false; // Oculta a mensagem de erro

    setTimeout(() => {
      const refreshInterval$ = timer(0, 3 * 60 * 1000);

      this.moedas$ = refreshInterval$.pipe(
        switchMap(() => {
          const timestamp = new Date().getTime();
          return this.service.getMoeda(
            `CAD-BRL,ARS-BRL,GBP-BRL?timestamp=${timestamp}`
          );
        })
      );

      this.moedas$.subscribe({
        next: (dados) => {
          if (typeof dados === 'object' && dados !== null) {
            const moedasArray = Object.values(dados);
            this.moedasSelecionadas = moedasArray.filter((moeda) =>
              this.isMoedaValida(moeda)
            );
            this.errorOccurred = false; // Reset error flag
            this.loading = false; // Desativa o indicador de carregamento
          } else {
            console.error('Dados recebidos não são um objeto:', dados);
            this.errorOccurred = true;
            this.loading = false;
          }
        },
        error: (error) => {
          console.error('Ocorreu um erro ao obter os dados:', error);
          this.errorOccurred = true;
          this.loading = false;
        },
      });
    }, 2000);
  }

  private isMoedaValida(moeda: Moeda): boolean {
    return (
      typeof moeda.bid === 'string' &&
      typeof moeda.varBid === 'string' &&
      typeof moeda.create_date === 'string'
    );
  }

  /*Pega o valor que esta vindo da API e define a coloração*/
  getClasseEstilo(lance: string): string {
    const valor = parseFloat(lance);

    if (valor <= 1) {
      return 'vermelho';
    } else if (valor <= 5) {
      return 'verde';
    } else {
      return 'azul';
    }
  }

  /*Isto é só para pegar somente o conteúdo do início do nome da moeda que recebemos da API*/
  obterNomeMoeda(moeda: Moeda): string {
    if (moeda.name && typeof moeda.name === 'string') {
      const partesNome = moeda.name.split('/');
      if (partesNome.length > 1) {
        return partesNome[0].trim(); // Extrai a segunda parte após o '/'
      }
    }
    return 'Nome não disponível';
  }
}
