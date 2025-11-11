import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../config/firebase';

export default function Pledge() {
  const { currentUser } = useAuth();
  const [pledgeText, setPledgeText] = useState('');
  const [signed, setSigned] = useState(false);
  const [name, setName] = useState('');

  const defaultPledge = `I commit to:
• Study regularly and consistently
• Set clear learning goals
• Seek help when needed
• Stay motivated and persistent
• Support my peers in their learning journey
• Believe in my ability to succeed`;

  const handleSignPledge = async () => {
    if (!currentUser) {
      alert('Please sign in to take the pledge');
      return;
    }

    const text = pledgeText || defaultPledge;
    try {
      await setDoc(doc(db, 'pledges', currentUser.uid), {
        text,
        name: name || currentUser.displayName || 'Student',
        signedAt: serverTimestamp(),
        uid: currentUser.uid
      });
      setSigned(true);
    } catch (error) {
      console.error('Error signing pledge:', error);
      alert('Error saving pledge');
    }
  };

  const handlePrintCertificate = () => {
    window.print();
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-4">Study Pledge</h1>
      <p className="text-gray-600 dark:text-gray-400 mb-8">
        Make a commitment to your education and print your certificate
      </p>

      {!signed ? (
        <div className="card max-w-2xl mx-auto">
          <h2 className="text-2xl font-bold mb-4">Your Study Pledge</h2>
          
          {currentUser && (
            <div className="mb-4">
              <label className="block mb-2 font-semibold">Your Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={currentUser.displayName || 'Enter your name'}
                className="w-full px-4 py-2 border rounded-lg bg-white dark:bg-gray-700"
              />
            </div>
          )}

          <div className="mb-4">
            <label className="block mb-2 font-semibold">Customize Your Pledge (optional)</label>
            <textarea
              rows="8"
              value={pledgeText}
              onChange={(e) => setPledgeText(e.target.value)}
              placeholder={defaultPledge}
              className="w-full px-4 py-2 border rounded-lg bg-white dark:bg-gray-700"
            />
          </div>

          <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg mb-6">
            <h3 className="font-bold mb-2">Preview:</h3>
            <p className="whitespace-pre-line">{pledgeText || defaultPledge}</p>
          </div>

          {currentUser ? (
            <button onClick={handleSignPledge} className="btn-primary w-full">
              ✍️ Sign Pledge
            </button>
          ) : (
            <div className="text-center">
              <p className="mb-4 text-gray-600 dark:text-gray-400">
                Please sign in to take the pledge
              </p>
              <a href="/auth/login" className="btn-primary">
                Sign In
              </a>
            </div>
          )}
        </div>
      ) : (
        <div className="card max-w-3xl mx-auto">
          <div className="text-center mb-8">
            <div className="text-6xl mb-4">🎓</div>
            <h2 className="text-3xl font-bold mb-2">Congratulations!</h2>
            <p className="text-gray-600 dark:text-gray-400">
              You've committed to your education journey
            </p>
          </div>

          {/* Printable Certificate */}
          <div className="border-4 border-blue-600 p-8 text-center print:border-black print:p-12">
            <h1 className="text-4xl font-bold mb-4 print:text-5xl">Certificate of Commitment</h1>
            <p className="text-xl mb-8 print:text-2xl">
              This certifies that
            </p>
            <p className="text-3xl font-bold mb-8 print:text-4xl border-b-2 border-gray-300 pb-4 inline-block">
              {name || currentUser?.displayName || 'Student'}
            </p>
            <p className="text-lg mb-6 print:text-xl">
              has committed to the following study pledge:
            </p>
            <div className="bg-gray-50 dark:bg-gray-700 p-6 rounded-lg mb-8 print:bg-white print:border-2">
              <p className="whitespace-pre-line text-left">{pledgeText || defaultPledge}</p>
            </div>
            <div className="flex justify-between mt-8 print:mt-12">
              <div>
                <div className="border-t-2 border-gray-300 pt-2">Date</div>
                <div>{new Date().toLocaleDateString()}</div>
              </div>
              <div>
                <div className="border-t-2 border-gray-300 pt-2">Signature</div>
                <div className="h-12"></div>
              </div>
            </div>
          </div>

          <div className="mt-8 flex gap-4 justify-center no-print">
            <button onClick={handlePrintCertificate} className="btn-primary">
              🖨️ Print Certificate
            </button>
            <button onClick={() => setSigned(false)} className="btn-secondary">
              Edit Pledge
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

