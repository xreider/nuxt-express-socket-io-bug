export default function({store, redirect, app}) {
  if (!Object.keys(store.state.user).length) {
    redirect(app.localePath('/?message=noUser'))
  }
}
