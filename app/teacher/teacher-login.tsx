'use client';

import { useState, type FormEvent } from 'react';
import { ArrowLeft, ArrowRight, Eye, EyeOff, LockKeyhole, RefreshCw } from 'lucide-react';
import { api } from '../ui';

export default function TeacherLogin({ onSignedIn }: { onSignedIn: () => Promise<void> }) {
  const [code, setCode] = useState('');
  const [visible, setVisible] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (busy) return;
    setBusy(true);
    setError('');
    try {
      await api('teacher-login', { code });
      setCode('');
      await onSignedIn();
    } catch (error) {
      setError((error as Error).message);
    } finally {
      setBusy(false);
    }
  }

  return <section className="teacher-auth" aria-labelledby="teacher-login-title">
    <span className="join-icon"><LockKeyhole size={30}/></span>
    <span className="eyebrow">FOR YOUR EYES ONLY</span>
    <h2 id="teacher-login-title">Your classroom, one code away.</h2>
    <p>Enter your private teacher code to see your students and their progress.</p>
    <form className="teacher-code-form" onSubmit={submit}>
      <label htmlFor="teacher-access-code">Teacher access code</label>
      <div className="teacher-code-input">
        <input id="teacher-access-code" name="teacherCode" type={visible ? 'text' : 'password'}
          value={code} onChange={event => setCode(event.target.value)}
          autoComplete="current-password" autoCapitalize="characters" spellCheck={false}
          placeholder="Enter your private code" required maxLength={64}
          aria-invalid={!!error} aria-describedby={error ? 'teacher-code-error' : 'teacher-code-note'}
          disabled={busy}/>
        <button type="button" className="icon-button" onClick={() => setVisible(!visible)}
          aria-label={visible ? 'Hide access code' : 'Show access code'} aria-pressed={visible}>
          {visible ? <EyeOff size={19}/> : <Eye size={19}/>}
        </button>
      </div>
      {error && <p className="teacher-code-error" id="teacher-code-error" role="alert">{error}</p>}
      <button className="button dark" type="submit" disabled={busy || !code.trim()}>
        {busy ? <><RefreshCw size={17} className="spin"/>Opening your classroom…</>
          : <>Open my dashboard<ArrowRight size={18}/></>}
      </button>
      <p className="supporting-note" id="teacher-code-note">Keep this code private. Use “Sign out” when you finish on a shared computer.</p>
    </form>
    <a className="back-link" href="/"><ArrowLeft size={15}/>Return to the student portal</a>
  </section>;
}
