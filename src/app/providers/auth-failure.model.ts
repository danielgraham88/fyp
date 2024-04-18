export class AuthFailure {

  constructor(  public type: string,
                public title: string,
                public status: number,
                public detail: string) {}
}
