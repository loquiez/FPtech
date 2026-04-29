'use client';
import { useState, useRef, useEffect, useId, useCallback } from 'react';
import 'flag-icons/css/flag-icons.min.css';

interface Country {
  code: string;
  name: string;
  dial: string;
  min: number;
  max: number;
  /** Regex tested against first digit(s) of the local number; must match to be valid */
  firstDigit?: RegExp;
}

const COUNTRIES: Country[] = [
  { code: 'RU', name: 'Россия',      dial: '+7',   min: 10, max: 10, firstDigit: /^9/     },
  { code: 'KZ', name: 'Казахстан',   dial: '+7',   min: 10, max: 10, firstDigit: /^7/     },
  { code: 'BY', name: 'Беларусь',    dial: '+375', min: 9,  max: 9  },
  { code: 'UZ', name: 'Узбекистан',  dial: '+998', min: 9,  max: 9  },
  { code: 'AZ', name: 'Азербайджан', dial: '+994', min: 9,  max: 9  },
  { code: 'AM', name: 'Армения',     dial: '+374', min: 8,  max: 8  },
  { code: 'GE', name: 'Грузия',      dial: '+995', min: 9,  max: 9  },
  { code: 'MD', name: 'Молдова',     dial: '+373', min: 8,  max: 8  },
  { code: 'CN', name: 'Китай',       dial: '+86',  min: 11, max: 11 },
  { code: 'AE', name: 'ОАЭ',        dial: '+971', min: 9,  max: 9  },
  { code: 'TR', name: 'Турция',      dial: '+90',  min: 10, max: 10 },
];

function formatPhone(pure: string, code: string): string {
  const d = pure.replace(/\D/g, '');
  if (!d) return '';
  switch (code) {
    case 'RU': case 'KZ': case 'TR': {
      // (XXX) XXX-XX-XX
      let r = '(' + d.slice(0, 3);
      if (d.length > 3) r += ') ' + d.slice(3, 6);
      if (d.length > 6) r += '-' + d.slice(6, 8);
      if (d.length > 8) r += '-' + d.slice(8, 10);
      return r;
    }
    case 'BY': case 'UZ': case 'AZ': {
      // (XX) XXX-XX-XX
      let r = '(' + d.slice(0, 2);
      if (d.length > 2) r += ') ' + d.slice(2, 5);
      if (d.length > 5) r += '-' + d.slice(5, 7);
      if (d.length > 7) r += '-' + d.slice(7, 9);
      return r;
    }
    case 'GE': {
      // (XXX) XX-XX-XX
      let r = '(' + d.slice(0, 3);
      if (d.length > 3) r += ') ' + d.slice(3, 5);
      if (d.length > 5) r += '-' + d.slice(5, 7);
      if (d.length > 7) r += '-' + d.slice(7, 9);
      return r;
    }
    case 'AM': case 'MD': {
      // (XX) XX-XX-XX
      let r = '(' + d.slice(0, 2);
      if (d.length > 2) r += ') ' + d.slice(2, 4);
      if (d.length > 4) r += '-' + d.slice(4, 6);
      if (d.length > 6) r += '-' + d.slice(6, 8);
      return r;
    }
    case 'CN': {
      // XXX XXXX XXXX
      let r = d.slice(0, 3);
      if (d.length > 3) r += ' ' + d.slice(3, 7);
      if (d.length > 7) r += ' ' + d.slice(7, 11);
      return r;
    }
    case 'AE': {
      // XX XXX XXXX
      let r = d.slice(0, 2);
      if (d.length > 2) r += ' ' + d.slice(2, 5);
      if (d.length > 5) r += ' ' + d.slice(5, 9);
      return r;
    }
    default:
      return d;
  }
}

interface Props {
  onValidChange: (valid: boolean) => void;
  submitAttempted: boolean;
}

export default function PhoneField({ onValidChange, submitAttempted }: Props) {
  const [country, setCountry] = useState(COUNTRIES[0]);
  const [digits, setDigits] = useState('');
  const [open, setOpen] = useState(false);
  const [touched, setTouched] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const id = useId();

  const pureDigits = digits.replace(/\D/g, '');
  const validFirstDigit = !country.firstDigit || !pureDigits || country.firstDigit.test(pureDigits);
  const valid = pureDigits.length >= country.min && pureDigits.length <= country.max && validFirstDigit;
  const fullPhone = country.dial + pureDigits;
  const showHint = ((touched && pureDigits.length > 0) || submitAttempted) && !valid;

  useEffect(() => { onValidChange(valid); }, [valid, onValidChange]);

  useEffect(() => {
    function handler(e: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const selectCountry = useCallback((c: Country) => {
    setCountry(c);
    setDigits('');
    setOpen(false);
  }, []);

  function handleInput(e: React.ChangeEvent<HTMLInputElement>) {
    const newRaw = e.target.value;
    const newPure = newRaw.replace(/\D/g, '');

    // If user deleted a separator (string shorter but digit count same), remove last digit too
    let effectivePure = newPure;
    if (newRaw.length < digits.length && newPure === pureDigits) {
      effectivePure = newPure.slice(0, -1);
    }

    // Strip trunk prefix for +7 countries: 8XXXXXXXXXX or 7XXXXXXXXXX → XXXXXXXXXX
    if (
      country.dial === '+7' &&
      effectivePure.length === country.max + 1 &&
      (effectivePure[0] === '8' || effectivePure[0] === '7')
    ) {
      effectivePure = effectivePure.slice(1);
    }

    if (effectivePure.length <= country.max) {
      setDigits(formatPhone(effectivePure, country.code));
    }
  }

  return (
    <div className="field">
      <input type="hidden" name="phone" value={fullPhone} />
      <div className="phone-field-outer" ref={wrapperRef}>
        <div className={`phone-field${showHint ? ' phone-field--error' : ''}`}>
          <div className="country-selector">
            <button
              type="button"
              className="country-btn"
              onClick={() => setOpen(o => !o)}
              aria-expanded={open}
              aria-haspopup="listbox"
            >
              <span className={`fi fi-${country.code.toLowerCase()}`} aria-hidden="true" />
              <span className="country-dial">{country.dial}</span>
              <svg
                className={`country-chevron${open ? ' open' : ''}`}
                width="10" height="10" viewBox="0 0 24 24"
                fill="none" stroke="currentColor" strokeWidth="2.5"
                aria-hidden="true"
              >
                <path d="M6 9l6 6 6-6" />
              </svg>
            </button>
          </div>

          <div className="phone-input-wrap">
            <input
              id={id}
              type="tel"
              className="phone-input"
              placeholder=" "
              value={digits}
              onChange={handleInput}
              onBlur={() => setTouched(true)}
              inputMode="tel"
              autoComplete="tel-national"
            />
            <label htmlFor={id} className="phone-label">Телефон</label>
          </div>
        </div>

        {open && (
          <ul className="country-dropdown" role="listbox">
            {COUNTRIES.map(c => (
              <li
                key={c.code}
                className={`country-option${c.code === country.code ? ' selected' : ''}`}
                role="option"
                aria-selected={c.code === country.code}
                onMouseDown={() => selectCountry(c)}
              >
                <span className={`fi fi-${c.code.toLowerCase()}`} aria-hidden="true" />
                <span className="country-option-name">{c.name}</span>
                <span className="country-option-dial">{c.dial}</span>
              </li>
            ))}
          </ul>
        )}
      </div>

      {showHint && (
        <p className="phone-hint">
          {!validFirstDigit && pureDigits.length > 0
            ? 'Неверный код оператора или региона'
            : 'Неправильно набран номер'}
        </p>
      )}
    </div>
  );
}
