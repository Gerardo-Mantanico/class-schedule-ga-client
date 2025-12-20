import React from 'react';
import Button from '../ui/button/Button';
import Input from '../form/input/InputField';

const KanbanBoard = () => {
  return (
    <div className="mx-auto max-w-7xl p-4 pb-20 md:p-6 md:pb-6">


      <div className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]">
        <div>
          <div className="flex flex-col items-center px-4 py-5 xl:px-6 xl:py-6">
            <div className="flex flex-col w-full gap-5 sm:justify-between xl:flex-row xl:items-center">
              <h1>Control de citas</h1>
              <div className="flex flex-wrap items-center gap-3 xl:justify-end">
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 border-t border-gray-200 divide-x divide-gray-200 dark:border-gray-800 mt-7 dark:divide-gray-800 sm:mt-0 sm:grid-cols-2 xl:grid-cols-2">

            {/* Columna "Hacer" */}
            <div>
              <div className="overflow-hidden">
                <div className="p-4 xl:p-6">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="flex items-center gap-3 text-base font-medium text-gray-800 dark:text-white/90">
                      Citas pendientes
                      <span className="inline-flex rounded-full px-2 py-0.5 text-xs font-medium bg-gray-100 text-gray-700 dark:bg-white/[0.03] dark:text-white/80">
                        3
                      </span>
                    </h3>
                  </div>

                  <div className="min-h-[200px] space-y-5 mt-5">
                    {/* Tarea 1 */}
                    <div draggable="true" className="p-5 bg-white border border-gray-200 task rounded-xl shadow-theme-sm dark:border-gray-800 dark:bg-white/5" data-draggable="true">
                      <div className="flex items-start justify-between gap-6">
                        <div>
                          <h4 className="mb-5 text-base text-gray-800 dark:text-white/90">
                            Finalizar la incorporación del usuario
                          </h4>
                          <div className="flex items-center gap-3">
                            <span className="flex items-center gap-1 text-sm text-gray-500 cursor-pointer dark:text-gray-400">
                              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-4 h-4">
                                <path fillRule="evenodd" clipRule="evenodd" d="M5.33329 1.0835C5.74751 1.0835 6.08329 1.41928 6.08329 1.8335V2.25016L9.91663 2.25016V1.8335C9.91663 1.41928 10.2524 1.0835 10.6666 1.0835C11.0808 1.0835 11.4166 1.41928 11.4166 1.8335V2.25016L12.3333 2.25016C13.2998 2.25016 14.0833 3.03366 14.0833 4.00016V6.00016L14.0833 12.6668C14.0833 13.6333 13.2998 14.4168 12.3333 14.4168L3.66663 14.4168C2.70013 14.4168 1.91663 13.6333 1.91663 12.6668L1.91663 6.00016L1.91663 4.00016C1.91663 3.03366 2.70013 2.25016 3.66663 2.25016L4.58329 2.25016V1.8335C4.58329 1.41928 4.91908 1.0835 5.33329 1.0835ZM5.33329 3.75016L3.66663 3.75016C3.52855 3.75016 3.41663 3.86209 3.41663 4.00016V5.25016L12.5833 5.25016V4.00016C12.5833 3.86209 12.4714 3.75016 12.3333 3.75016L10.6666 3.75016L5.33329 3.75016ZM12.5833 6.75016L3.41663 6.75016L3.41663 12.6668C3.41663 12.8049 3.52855 12.9168 3.66663 12.9168L12.3333 12.9168C12.4714 12.9168 12.5833 12.8049 12.5833 12.6668L12.5833 6.75016Z" fill="currentColor"></path>
                              </svg>
                              Mañana
                            </span>
                            <span className="flex items-center gap-1 text-sm text-gray-500 cursor-pointer dark:text-gray-400">
                              <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-4 h-4">
                                <path d="M9 15.6343C12.6244 15.6343 15.5625 12.6961 15.5625 9.07178C15.5625 5.44741 12.6244 2.50928 9 2.50928C5.37563 2.50928 2.4375 5.44741 2.4375 9.07178C2.4375 10.884 3.17203 12.5246 4.35961 13.7122L2.4375 15.6343H9Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"></path>
                              </svg>
                              1
                            </span>
                          </div>
                        </div>
                        <div className="h-6 w-6 shrink-0 overflow-hidden rounded-full border-[0.5px] border-gray-200 dark:border-gray-800">
                          <img src="/images/user/user-01.jpg" alt="Finalizar la incorporación del usuario" />
                        </div>
                      </div>
                    </div>


                    {/* Tarea 2 */}
                    <div draggable="true" className="p-5 bg-white border border-gray-200 task rounded-xl shadow-theme-sm dark:border-gray-800 dark:bg-white/5" data-draggable="true">
                      <div className="flex items-start justify-between gap-6">
                        <div>
                          <h4 className="mb-5 text-base text-gray-800 dark:text-white/90">
                            Finalizar la incorporación del usuario
                          </h4>
                          <div className="flex items-center gap-3">
                            <span className="flex items-center gap-1 text-sm text-gray-500 cursor-pointer dark:text-gray-400">
                              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-4 h-4">
                                <path fillRule="evenodd" clipRule="evenodd" d="M5.33329 1.0835C5.74751 1.0835 6.08329 1.41928 6.08329 1.8335V2.25016L9.91663 2.25016V1.8335C9.91663 1.41928 10.2524 1.0835 10.6666 1.0835C11.0808 1.0835 11.4166 1.41928 11.4166 1.8335V2.25016L12.3333 2.25016C13.2998 2.25016 14.0833 3.03366 14.0833 4.00016V6.00016L14.0833 12.6668C14.0833 13.6333 13.2998 14.4168 12.3333 14.4168L3.66663 14.4168C2.70013 14.4168 1.91663 13.6333 1.91663 12.6668L1.91663 6.00016L1.91663 4.00016C1.91663 3.03366 2.70013 2.25016 3.66663 2.25016L4.58329 2.25016V1.8335C4.58329 1.41928 4.91908 1.0835 5.33329 1.0835ZM5.33329 3.75016L3.66663 3.75016C3.52855 3.75016 3.41663 3.86209 3.41663 4.00016V5.25016L12.5833 5.25016V4.00016C12.5833 3.86209 12.4714 3.75016 12.3333 3.75016L10.6666 3.75016L5.33329 3.75016ZM12.5833 6.75016L3.41663 6.75016L3.41663 12.6668C3.41663 12.8049 3.52855 12.9168 3.66663 12.9168L12.3333 12.9168C12.4714 12.9168 12.5833 12.8049 12.5833 12.6668L12.5833 6.75016Z" fill="currentColor"></path>
                              </svg>
                              Mañana
                            </span>
                            <span className="flex items-center gap-1 text-sm text-gray-500 cursor-pointer dark:text-gray-400">
                              <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-4 h-4">
                                <path d="M9 15.6343C12.6244 15.6343 15.5625 12.6961 15.5625 9.07178C15.5625 5.44741 12.6244 2.50928 9 2.50928C5.37563 2.50928 2.4375 5.44741 2.4375 9.07178C2.4375 10.884 3.17203 12.5246 4.35961 13.7122L2.4375 15.6343H9Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"></path>
                              </svg>
                              1
                            </span>


                            <div className="flex items-center justify-between border-t border-gray-200 p-5 dark:border-gray-800">
                              <div className="flex gap-3">
                                <button className="shadow-theme-xs inline-flex h-11 w-11 items-center justify-center rounded-lg border border-gray-300 text-gray-700 dark:border-gray-700 dark:text-gray-400">
                                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                                    <path d="M5.64615 4.59906C5.05459 4.25752 4.29808 4.46015 3.95654 5.05171L2.69321 7.23986C2.35175 7.83128 2.5544 8.58754 3.14582 8.92899C3.97016 9.40493 3.97017 10.5948 3.14583 11.0707C2.55441 11.4122 2.35178 12.1684 2.69323 12.7598L3.95657 14.948C4.2981 15.5395 5.05461 15.7422 5.64617 15.4006C6.4706 14.9247 7.50129 15.5196 7.50129 16.4715C7.50129 17.1545 8.05496 17.7082 8.73794 17.7082H11.2649C11.9478 17.7082 12.5013 17.1545 12.5013 16.4717C12.5013 15.5201 13.5315 14.9251 14.3556 15.401C14.9469 15.7423 15.7029 15.5397 16.0443 14.9485L17.3079 12.7598C17.6494 12.1684 17.4467 11.4121 16.8553 11.0707C16.031 10.5948 16.031 9.40494 16.8554 8.92902C17.4468 8.58757 17.6494 7.83133 17.3079 7.23992L16.0443 5.05123C15.7029 4.45996 14.9469 4.25737 14.3556 4.59874C13.5315 5.07456 12.5013 4.47961 12.5013 3.52798C12.5013 2.84515 11.9477 2.2915 11.2649 2.2915L8.73795 2.2915C8.05496 2.2915 7.50129 2.84518 7.50129 3.52816C7.50129 4.48015 6.47059 5.07505 5.64615 4.59906Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                                    </path>
                                    <path d="M12.5714 9.99977C12.5714 11.4196 11.4204 12.5706 10.0005 12.5706C8.58069 12.5706 7.42969 11.4196 7.42969 9.99977C7.42969 8.57994 8.58069 7.42894 10.0005 7.42894C11.4204 7.42894 12.5714 8.57994 12.5714 9.99977Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                                    </path>
                                  </svg>
                                </button>
                                <button className="shadow-theme-xs inline-flex h-11 items-center justify-center rounded-lg border border-gray-300 px-4 py-3 text-sm font-medium text-gray-700 dark:border-gray-700 dark:text-gray-400"> Details
                                </button></div><label htmlFor="toggle-2" className="cursor-pointer">
                                  <div className="relative">
                                  <Input type="checkbox" id="toggle-2" className="sr-only" aria-checked="true" role="switch"><div className="block h-6 w-11 rounded-full bg-brand-500 dark:bg-brand-500"></div><div className="translate-x-full shadow-theme-sm absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white duration-200 ease-linear"></div></div></label></div>


                      

                          </div>
                        </div>
                        <div className="h-6 w-6 shrink-0 overflow-hidden rounded-full border-[0.5px] border-gray-200 dark:border-gray-800">
                          <img src="/images/user/user-01.jpg" alt="Finalizar la incorporación del usuario" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Columna "En curso" */}
            <div>
              <div className="overflow-hidden">
                <div className="p-4 xl:p-6">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="flex items-center gap-3 text-base font-medium text-gray-800 dark:text-white/90">
                      En curso
                      <span className="inline-flex rounded-full px-2 py-0.5 text-xs font-medium bg-warning-50 text-warning-700 dark:bg-warning-500/15 dark:text-orange-400">
                        4
                      </span>
                    </h3>

                  </div>

                  <div className="min-h-[200px] space-y-5 mt-5">
                    {/* Tarea 1 */}
                    <div draggable="true" className="p-5 bg-brand-100 border border-gray-200 task rounded-xl shadow-theme-sm dark:border-gray-800 dark:bg-white/5" data-draggable="true">
                      <div className="flex items-start justify-between gap-6">
                        <div>
                          <h4 className="mb-5 text-base text-gray-800 dark:text-white/90">
                            Finalizar la incorporación del usuario
                          </h4>
                          <div className="flex items-center gap-3">
                            <span className="flex items-center gap-1 text-sm text-gray-500 cursor-pointer dark:text-gray-400">
                              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-4 h-4">
                                <path fillRule="evenodd" clipRule="evenodd" d="M5.33329 1.0835C5.74751 1.0835 6.08329 1.41928 6.08329 1.8335V2.25016L9.91663 2.25016V1.8335C9.91663 1.41928 10.2524 1.0835 10.6666 1.0835C11.0808 1.0835 11.4166 1.41928 11.4166 1.8335V2.25016L12.3333 2.25016C13.2998 2.25016 14.0833 3.03366 14.0833 4.00016V6.00016L14.0833 12.6668C14.0833 13.6333 13.2998 14.4168 12.3333 14.4168L3.66663 14.4168C2.70013 14.4168 1.91663 13.6333 1.91663 12.6668L1.91663 6.00016L1.91663 4.00016C1.91663 3.03366 2.70013 2.25016 3.66663 2.25016L4.58329 2.25016V1.8335C4.58329 1.41928 4.91908 1.0835 5.33329 1.0835ZM5.33329 3.75016L3.66663 3.75016C3.52855 3.75016 3.41663 3.86209 3.41663 4.00016V5.25016L12.5833 5.25016V4.00016C12.5833 3.86209 12.4714 3.75016 12.3333 3.75016L10.6666 3.75016L5.33329 3.75016ZM12.5833 6.75016L3.41663 6.75016L3.41663 12.6668C3.41663 12.8049 3.52855 12.9168 3.66663 12.9168L12.3333 12.9168C12.4714 12.9168 12.5833 12.8049 12.5833 12.6668L12.5833 6.75016Z" fill="currentColor"></path>
                              </svg>
                              Mañana
                            </span>
                            <span className="flex items-center gap-1 text-sm text-gray-500 cursor-pointer dark:text-gray-400">
                              <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-4 h-4">
                                <path d="M9 15.6343C12.6244 15.6343 15.5625 12.6961 15.5625 9.07178C15.5625 5.44741 12.6244 2.50928 9 2.50928C5.37563 2.50928 2.4375 5.44741 2.4375 9.07178C2.4375 10.884 3.17203 12.5246 4.35961 13.7122L2.4375 15.6343H9Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"></path>
                              </svg>
                              1
                            </span>
                          </div>
                        </div>
                        <div className="h-6 w-6 shrink-0 overflow-hidden rounded-full border-[0.5px] border-gray-200 dark:border-gray-800">
                          <img src="/images/user/user-01.jpg" alt="Finalizar la incorporación del usuario" />
                        </div>
                      </div>
                    </div>

                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default KanbanBoard;