'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';

type PaymentMethod = 'pix' | 'card' | 'boleto';

interface CheckoutFormData {
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  zipCode: string;
  street: string;
  number: string;
  complement?: string;
  neighborhood: string;
  city: string;
  state: string;
  paymentMethod: PaymentMethod;
}

export function CheckoutForm() {
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('pix');
  const {
    register,
    handleSubmit,
    setValue,
    formState: { isSubmitting },
  } = useForm<CheckoutFormData>();

  const handleZipCode = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const cep = e.target.value.replace(/\D/g, '');
    if (cep.length === 8) {
      try {
        const res = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
        const data = await res.json();
        if (!data.erro) {
          setValue('street', data.logradouro);
          setValue('neighborhood', data.bairro);
          setValue('city', data.localidade);
          setValue('state', data.uf);
        }
      } catch {
        // CEP lookup failed silently
      }
    }
  };

  const onSubmit = async (_data: CheckoutFormData) => {
    // TODO: integrate with Mercado Pago SDK
  };

  const inputClass =
    'w-full border border-zinc-200 rounded-sm px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ink text-ink';
  const labelClass = 'block text-xs font-semibold text-zinc-600 mb-1 uppercase tracking-wide';
  const sectionClass = 'bg-white rounded-lg p-6 shadow-card mb-4';

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {/* 1. Identificação */}
      <div className={sectionClass}>
        <h2 className="font-display text-2xl text-ink mb-4">1. IDENTIFICAÇÃO</h2>
        <div>
          <label className={labelClass}>E-mail</label>
          <input
            {...register('email', { required: true })}
            type="email"
            placeholder="seu@email.com"
            className={inputClass}
          />
        </div>
        <div className="grid grid-cols-2 gap-3 mt-3">
          <div>
            <label className={labelClass}>Nome</label>
            <input {...register('firstName', { required: true })} className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Sobrenome</label>
            <input {...register('lastName', { required: true })} className={inputClass} />
          </div>
        </div>
        <div className="mt-3">
          <label className={labelClass}>Telefone</label>
          <input
            {...register('phone')}
            type="tel"
            placeholder="(11) 99999-9999"
            className={inputClass}
          />
        </div>
      </div>

      {/* 2. Endereço */}
      <div className={sectionClass}>
        <h2 className="font-display text-2xl text-ink mb-4">2. ENDEREÇO</h2>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className={labelClass}>CEP</label>
            <input
              {...register('zipCode', { required: true })}
              placeholder="00000-000"
              className={inputClass}
              onChange={handleZipCode}
            />
          </div>
        </div>
        <div className="grid grid-cols-3 gap-3 mt-3">
          <div className="col-span-2">
            <label className={labelClass}>Rua</label>
            <input {...register('street', { required: true })} className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Número</label>
            <input {...register('number', { required: true })} className={inputClass} />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3 mt-3">
          <div>
            <label className={labelClass}>Complemento</label>
            <input
              {...register('complement')}
              placeholder="Apto, bloco..."
              className={inputClass}
            />
          </div>
          <div>
            <label className={labelClass}>Bairro</label>
            <input {...register('neighborhood', { required: true })} className={inputClass} />
          </div>
        </div>
        <div className="grid grid-cols-3 gap-3 mt-3">
          <div className="col-span-2">
            <label className={labelClass}>Cidade</label>
            <input {...register('city', { required: true })} className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Estado</label>
            <input
              {...register('state', { required: true })}
              maxLength={2}
              className={inputClass}
            />
          </div>
        </div>
      </div>

      {/* 3. Pagamento */}
      <div className={sectionClass}>
        <h2 className="font-display text-2xl text-ink mb-4">3. PAGAMENTO</h2>

        <div className="flex gap-2 mb-4">
          {(['pix', 'card', 'boleto'] as PaymentMethod[]).map((method) => (
            <button
              key={method}
              type="button"
              onClick={() => setPaymentMethod(method)}
              className={`flex-1 py-2.5 text-sm font-semibold rounded-sm border-2 transition-colors ${
                paymentMethod === method
                  ? 'border-ink bg-ink text-paper'
                  : 'border-zinc-200 text-zinc-600 hover:border-ink'
              }`}
            >
              {method === 'pix' ? '⚡ PIX' : method === 'card' ? '💳 Cartão' : '📄 Boleto'}
            </button>
          ))}
        </div>

        {paymentMethod === 'pix' && (
          <div className="bg-green-50 rounded-md p-4 text-sm text-green-700">
            <p className="font-semibold">Pagamento via PIX</p>
            <p className="mt-1 text-xs">
              QR Code gerado após confirmação do pedido. Válido por 30 minutos.
            </p>
          </div>
        )}

        {paymentMethod === 'card' && (
          <div className="space-y-3">
            <div>
              <label className={labelClass}>Número do cartão</label>
              <input placeholder="0000 0000 0000 0000" className={inputClass} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className={labelClass}>Validade</label>
                <input placeholder="MM/AA" className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>CVV</label>
                <input placeholder="000" className={inputClass} />
              </div>
            </div>
            <div>
              <label className={labelClass}>Nome no cartão</label>
              <input className={inputClass} />
            </div>
          </div>
        )}

        {paymentMethod === 'boleto' && (
          <div className="bg-zinc-50 rounded-md p-4 text-sm text-zinc-600">
            <p className="font-semibold">Pagamento via Boleto</p>
            <p className="mt-1 text-xs">
              Boleto gerado após confirmação. Prazo de vencimento: 3 dias úteis.
            </p>
          </div>
        )}
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full flex items-center justify-center gap-2 bg-sun text-ink font-bold py-4 rounded-md hover:bg-yellow-400 transition-colors text-base disabled:opacity-50"
      >
        🔒 {isSubmitting ? 'Processando...' : 'CONFIRMAR PEDIDO'}
      </button>
    </form>
  );
}
