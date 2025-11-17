Admin::Engine.routes.draw do
  root "dashboard#index"
  resources :dashboard, only: [:index]
  resources :reports, only: [:index]
end
