'use client'

import { useCV } from '@/context/CVContext'
import { FormField } from '@/components/shared/form/FormField'
import { TextInput } from '@/components/shared/form/TextInput'
import { TextArea } from '@/components/shared/form/TextArea'
import { FieldGroup } from '@/components/shared/form/FieldGroup'
import { type Profile } from '@/types/cv'

export function ProfileEditor() {
  const { state, updateProfileField } = useCV()
  const { profile } = state.resume

  const handleChange = (field: keyof Profile, value: string) => {
    updateProfileField(field, value)
  }

  return (
    <div className="space-y-4">
      <FormField label="Full Name" required>
        <TextInput
          placeholder="e.g. John Doe"
          value={profile.name}
          onChange={(e) => handleChange('name', e.target.value)}
        />
      </FormField>

      <FieldGroup columns={2}>
        <FormField label="Email">
          <TextInput
            type="email"
            placeholder="john@example.com"
            value={profile.email}
            onChange={(e) => handleChange('email', e.target.value)}
          />
        </FormField>
        <FormField label="Phone">
          <TextInput
            type="tel"
            placeholder="+1 234 567 890"
            value={profile.phone}
            onChange={(e) => handleChange('phone', e.target.value)}
          />
        </FormField>
      </FieldGroup>

      <FormField label="Location">
        <TextInput
          placeholder="e.g. New York, NY"
          value={profile.location}
          onChange={(e) => handleChange('location', e.target.value)}
        />
      </FormField>

      <FieldGroup columns={2}>
        <FormField label="Website">
          <TextInput
            type="url"
            placeholder="https://example.com"
            value={profile.website}
            onChange={(e) => handleChange('website', e.target.value)}
          />
        </FormField>
        <FormField label="GitHub">
          <TextInput
            placeholder="github.com/username"
            value={profile.github}
            onChange={(e) => handleChange('github', e.target.value)}
          />
        </FormField>
      </FieldGroup>

      <FormField label="LinkedIn">
        <TextInput
          placeholder="linkedin.com/in/username"
          value={profile.linkedin}
          onChange={(e) => handleChange('linkedin', e.target.value)}
        />
      </FormField>

      <FormField label="Professional Summary">
        <TextArea
          placeholder="Brief overview of your career and skills..."
          value={profile.summary}
          onChange={(e) => handleChange('summary', e.target.value)}
        />
      </FormField>
    </div>
  )
}
